package web

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/verbindigs-mecher/internal/models"
	"github.com/verbindigs-mecher/internal/tripcomparator"
	"github.com/verbindigs-mecher/internal/triploader"
)

func RegisterScheduleRoutes(r *gin.RouterGroup) {
	scheduleGroup := r.Group("/schedule")
	scheduleGroup.GET("/diffs", scheduleDiffsEndpoint)
	scheduleGroup.GET("/stops", findStationEndpoint)
	scheduleGroup.GET("/businfo", busInfoEndpoint)
}

func busInfoEndpoint(c *gin.Context) {
	stationId := c.Query("stationId")
	regularArrTime := c.Query("regularArrTime")
	delayedArrTime := c.Query("delayedArrTime")
	unixDay := c.Query("day")

	if stationId == "" || regularArrTime == "" || delayedArrTime == "" || unixDay == "" {
		return
	}

	unixDayInt, err := strconv.ParseInt(unixDay, 10, 0)
	dayAsNInYear := int(time.Unix(unixDayInt, 0).Sub(time.Date(2023, 12, 10, 0, 0, 0, 0, time.Local)).Hours() / 24)

	query := fmt.Sprintf(`with bus_stations as (SELECT to_stop_id, walk_minutes FROM stop_relations WHERE from_stop_id = %s)
		SELECT stops.stop_name, fst.stop_departure, walk_minutes, dest_stops.stop_name, agency.short_name FROM fplan
		JOIN fplan_trip_bitfeld ftb ON ftb.fplan_row_idx = fplan.row_idx
		JOIN fplan_stop_times fst ON fst.fplan_trip_bitfeld_id=ftb.fplan_trip_bitfeld_id
		JOIN bus_stations as bs ON bs.to_stop_id=fst.stop_id
		JOIN calendar as c ON c.service_id=ftb.service_id
		JOIN stops ON stops.stop_id=fst.stop_id
		JOIN stops as dest_stops ON dest_stops.stop_id=ftb.to_stop_id
		JOIN agency ON agency.agency_id=fplan.agency_id
		WHERE fst.stop_id IN (SELECT to_stop_id from bus_stations)
		AND SUBSTR(c.day_bits, %d, 1) = '1'
		AND fst.stop_departure IS NOT ''
		AND fplan.vehicle_type LIKE 'B';`, stationId, dayAsNInYear)

	searchDB, err := sql.Open("sqlite3", "./db/planned_schedule.sqlite")
	if err != nil {
		return
	}

	res, err := searchDB.Query(query)

	if err != nil {
		return
	}

	missedConnections := make([]models.MissedConnection, 0)

	for res.Next() {
		item := models.MissedConnection{}

		err := res.Scan(&item.StopName, &item.StopDeparture, &item.WalkMinutes, &item.DestinationStopName, &item.Agency)

		if err != nil {
			return
		}

		parsedItemTime := parseTimeFromSBBString(item.StopDeparture)

		parsedRegularArrTime := parseTimeFromSBBString(regularArrTime)

		parsedDelayedArrTime := parseTimeFromSBBString(delayedArrTime)

		if parsedItemTime.After(parsedRegularArrTime.Add(time.Duration(item.WalkMinutes)*time.Minute)) && parsedItemTime.Before(parsedDelayedArrTime.Add(time.Duration(item.WalkMinutes)*time.Minute)) {
			missedConnections = append(missedConnections, item)
		}
	}

	c.JSON(http.StatusOK, missedConnections)
}

func parseTimeFromSBBString(timeString string) time.Time {
	hourPart := timeString[0:2]
	minutePart := timeString[2:4]

	hourInt, err := strconv.ParseInt(hourPart, 10, 0)
	if err != nil {
		return time.Now()
	}
	minuteInt, err := strconv.ParseInt(minutePart, 10, 0)
	if err != nil {
		return time.Now()
	}
	return time.Date(0, 0, 0, int(hourInt), int(minuteInt), 0, 0, time.Local)
}

func findStationEndpoint(c *gin.Context) {
	searchDB, err := sql.Open("sqlite3", "./db/planned_schedule.sqlite")
	if err != nil {
		return
	}

	res, err := searchDB.Query(fmt.Sprintf("SELECT stop_id, stop_name FROM stops WHERE stops.in_fplan=1 AND lower(stop_name) LIKE '%s' LIMIT 50", "%"+c.Query("searchTerm")+"%"))

	if err != nil {
		return
	}

	stops := make([]models.Stop, 0)

	for res.Next() {
		item := models.Stop{}

		err := res.Scan(&item.Id, &item.Name)

		if err != nil {
			return
		}

		stops = append(stops, item)
	}

	c.JSON(http.StatusOK, stops)
}

func findStationName(stationId string) string {
	searchDB, err := sql.Open("sqlite3", "./db/planned_schedule.sqlite")
	if err != nil {
		return ""
	}

	res, err := searchDB.Query(fmt.Sprintf("SELECT stop_name FROM stops WHERE stops.stop_id='%s'", stationId))

	if err != nil {
		return ""
	}

	for res.Next() {
		name := ""
		err := res.Scan(&name)
		if err != nil {
			return ""
		}
		return name
	}

	return ""
}

func parseDayInYearFromString(inputString string, defaultValue int) int {
	if inputString == "" {
		return defaultValue
	}

	splitString := strings.Split(inputString, "-")

	yearInt, err := strconv.ParseInt(splitString[0], 10, 0)
	if err != nil {
		return defaultValue
	}
	MonthInt, err := strconv.ParseInt(splitString[1], 10, 0)
	if err != nil {
		return defaultValue
	}
	DayInt, err := strconv.ParseInt(splitString[2], 10, 0)
	if err != nil {
		return defaultValue
	}
	parsedDate := time.Date(int(yearInt), time.Month(MonthInt), int(DayInt), 0, 0, 0, 0, time.Local)
	scheduleStartDate := time.Date(2023, 12, 10, 0, 0, 0, 0, time.Local)

	// SBB bitmap starts at 1 for some reason
	return int(parsedDate.Sub(scheduleStartDate).Hours()/24) + 1
}

func scheduleDiffsEndpoint(c *gin.Context) {
	stationIds := c.Query("stationIds")
	startDate := c.Query("startDate")
	endDate := c.Query("endDate")

	startDayInYear := parseDayInYearFromString(startDate, 0)
	endDayInYear := parseDayInYearFromString(endDate, 366)

	stationDiffs := make([]models.StationDiff, 0)

	if stationIds == "" {
		c.JSON(http.StatusOK, stationDiffs)
		return
	}

	for _, v := range strings.Split(stationIds, ",") {
		stationDiffsOnDay := make([]models.DayDiff, 0)

		for y := range endDayInYear - startDayInYear + 1 {
			actualYear := y + startDayInYear
			plannedTrips, err := triploader.LoadTrips("./db/planned_schedule.sqlite", v, actualYear)

			if err != nil {
				println(err.Error())
				return
			}

			constructionTrips, err := triploader.LoadTrips("./db/construction_schedule.sqlite", v, actualYear)
			if err != nil {
				println(err.Error())
				return
			}

			diffsOnDay := tripcomparator.CompareTrips(plannedTrips, constructionTrips, actualYear)
			if len(*diffsOnDay) == 0 {
				continue
			}

			for i, _ := range *diffsOnDay {
				alternateTrain, err := tripcomparator.FindAlternateTrain((*diffsOnDay)[i].Agency, (*diffsOnDay)[i].TrainNumber, v, constructionTrips, actualYear)
				if err != nil {
					(*diffsOnDay)[i].AlternateTrain = nil
					continue
				}
				(*diffsOnDay)[i].AlternateTrain = alternateTrain
			}

			stationDiffsOnDay = append(stationDiffsOnDay, models.DayDiff{
				Date:        time.Date(2023, 12, 10, 0, 0, 0, 0, time.Local).AddDate(0, 0, actualYear),
				Differences: *diffsOnDay,
			})
		}

		stationDiffs = append(stationDiffs, models.StationDiff{
			Name:              findStationName(v),
			DifferencesPerDay: stationDiffsOnDay,
		})
	}
	c.JSON(http.StatusOK, stationDiffs)
}
