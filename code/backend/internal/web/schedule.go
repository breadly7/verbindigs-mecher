package web

import (
	"database/sql"
	"fmt"
	"net/http"
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

func scheduleDiffsEndpoint(c *gin.Context) {
	stationIds := []string{"8507483"}
	stationNames := []string{"Spiez"}

	stationDiffs := make([]models.StationDiff, 0)
	for i := range stationIds {
		stationDiffsOnDay := make([]models.DayDiff, 0)

		for y := range 366 {
			plannedTrips, err := triploader.LoadTrips("./db/planned_schedule.sqlite", stationIds[i], y)

			if err != nil {
				println(err.Error())
				return
			}

			constructionTrips, err := triploader.LoadTrips("./db/construction_schedule.sqlite", stationIds[i], y)
			if err != nil {
				println(err.Error())
				return
			}

			diffsOnDay := tripcomparator.CompareTrips(plannedTrips, constructionTrips, y)
			if len(*diffsOnDay) == 0 {
				continue
			}

			stationDiffsOnDay = append(stationDiffsOnDay, models.DayDiff{
				Date:        time.Date(2023, 12, 10, 0, 0, 0, 0, time.Local).AddDate(0, 0, y),
				Differences: *diffsOnDay,
			})
		}

		stationDiffs = append(stationDiffs, models.StationDiff{
			Name:              stationNames[i],
			DifferencesPerDay: stationDiffsOnDay,
		})
	}
	c.JSON(http.StatusOK, stationDiffs)
}
