package triploader

import (
	"database/sql"
	"errors"
	"fmt"
	"regexp"

	"github.com/verbindigs-mecher/internal/models"
)

func LoadTrips(dbpath string, stopId string, dayInYear int) (*[]models.Trip, error) {
	var re = regexp.MustCompile(`(?m)^(\d+)\s+([A-Za-zäöüÄÖÔÜÙÛÁÀËÉÈÂÎÏŸŒßùûòôâáàéèëœîïÿ,.()/\s-]+?)\s+(-?\d{5})\s+(-?\d{5})?\s+%`)

	searchDB, err := sql.Open("sqlite3", dbpath)
	if err != nil {
		return nil, errors.New("failed to open db")
	}

	var trips []models.Trip
	res, err := searchDB.Query(fmt.Sprintf("SELECT stops.stop_name, fplan.vehicle_type, fplan.service_line, fplan.fplan_trip_id as train_number, group_concat(fplan_stop_times.stop_id) AS stop_id, group_concat(fplan_stop_times.stop_departure) AS stop_deps, group_concat(fplan_stop_times.stop_arrival) AS stop_arrs, fplan.fplan_content, agency.short_name FROM fplan, fplan_trip_bitfeld, calendar, fplan_stop_times, stops, agency WHERE fplan.row_idx=fplan_trip_bitfeld.fplan_row_idx AND stops.stop_id=fplan_stop_times.stop_id AND fplan_trip_bitfeld.fplan_trip_bitfeld_id = fplan_stop_times.fplan_trip_bitfeld_id AND fplan_stop_times.stop_id ='%s' AND fplan_trip_bitfeld.service_id = calendar.service_id AND agency.agency_id=fplan.agency_id AND SUBSTR(calendar.day_bits, %d, 1) = '1' GROUP BY fplan_trip_bitfeld.fplan_trip_bitfeld_id;", stopId, dayInYear))

	if err != nil {
		return nil, errors.New("failed to query")
	}

	for res.Next() {
		item := models.Trip{}
		item.DayInYear = dayInYear

		err = res.Scan(&item.StopName, &item.VehicleType, &item.ServiceLine, &item.TrainNumber, &item.StopId, &item.DepTime, &item.ArrTime, &item.Content, &item.Agency)
		if err != nil {
			return nil, errors.New("failed to scan")
		}

		if item.ArrTime == "" {
			continue
		}

		matches := re.FindAllStringSubmatch(item.Content, -1)

		item.TrainLineStops = getTrainLineStopsByMatches(matches)
		for i, v := range matches {
			if v[1] == stopId {
				if i != 0 {
					item.PreviousStopId = matches[i-1][1]
					item.PreviousStopName = matches[i-1][2]
					continue
				}
			}
		}

		trips = append(trips, item)
	}

	defer func(searchDB *sql.DB) {
		err := searchDB.Close()
		if err != nil {
			return
		}
	}(searchDB)

	return &trips, nil
}

func getTrainLineStopsByMatches(matches [][]string) []models.LineStop {
	trainLineStops := make([]models.LineStop, 0)

	for index, _ := range matches {
		var depTime, arrTime string
		if index == 0 {
			arrTime = ""
			depTime = matches[index][3]
		} else if index == len(matches) {
			depTime = matches[index][3]
			depTime = ""
		} else {
			arrTime = matches[index][3]
			depTime = matches[index][4]
		}

		trainLineStops = append(trainLineStops, models.LineStop{
			StopId:   matches[index][1],
			StopName: matches[index][2],
			DepTime:  depTime,
			ArrTime:  arrTime,
		})
	}

	return trainLineStops
}
