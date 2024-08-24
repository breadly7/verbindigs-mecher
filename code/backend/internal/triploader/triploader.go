package triploader

import (
	"database/sql"
	"errors"
	"fmt"
	"github.com/verbindigs-mecher/internal/models"
	"regexp"
)

func Loadtrips(dbpath string, stopId string, dayInYear int) (*[]models.Trip, error) {
	var re = regexp.MustCompile(`(?m)^(\d+)\s+([A-Za-zäöüÄÖÔÜÙÛÁÀËÉÈÙÂÎÏŸŒßùûòôâáàéèëœîïÿ,.()/\s-]+?)\s+(-?\d{5})\s+(-?\d{5})?\s+%`)

	searchDB, err := sql.Open("sqlite3", dbpath)
	var trips []models.Trip
	res, err := searchDB.Query(fmt.Sprintf("SELECT stops.stop_name, group_concat(fplan_stop_times.stop_id) AS stop_id, group_concat(fplan_stop_times.stop_departure) AS stop_deps, group_concat(fplan_stop_times.stop_arrival) AS stop_arrs, fplan.fplan_content FROM fplan, fplan_trip_bitfeld, calendar, fplan_stop_times, stops WHERE fplan.row_idx=fplan_trip_bitfeld.fplan_row_idx AND stops.stop_id=fplan_stop_times.stop_id AND fplan_trip_bitfeld.fplan_trip_bitfeld_id = fplan_stop_times.fplan_trip_bitfeld_id and fplan_stop_times.stop_id ='%s' AND fplan_trip_bitfeld.service_id = calendar.service_id AND SUBSTR(calendar.day_bits, %d, 1) = '1' GROUP BY fplan_trip_bitfeld.fplan_trip_bitfeld_id;", stopId, dayInYear))

	if err != nil {
		return nil, errors.New("failed to query")
	}

	for res.Next() {
		item := models.Trip{}

		err = res.Scan(&item.StopName, &item.StopId, &item.DepTime, &item.ArrTime, &item.Content)
		if err != nil {
			return nil, errors.New("failed to scan")
		}

		if item.ArrTime == "" {
			continue
		}

		matches := re.FindAllStringSubmatch(item.Content, -1)

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
