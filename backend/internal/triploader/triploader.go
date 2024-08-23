package triploader

import (
	"database/sql"
	"errors"
	"github.com/verbindigs-mecher/internal/models"
)

func Loadtrips(dbpath string) (*[]models.Trip, error) {
	searchDB, err := sql.Open("sqlite3", dbpath)

	var trips []models.Trip
	res, err := searchDB.Query("select fbf.fplan_row_idx, ft.fplan_trip_bitfeld_id, fbf.service_id, s.stop_name, ft.stop_arrival, ft.stop_departure, f.vehicle_type from fplan as f join fplan_trip_bitfeld as fbf on f.row_idx=fbf.fplan_row_idx join fplan_stop_times as ft on fbf.fplan_trip_bitfeld_id=ft.fplan_trip_bitfeld_id join stops as s on s.stop_id=ft.stop_id where s.stop_name='Mauchen, Berner'")

	if err != nil {
		return nil, errors.New("failed to query")
	}

	for res.Next() {
		item := models.Trip{}
		err = res.Scan(&item.FPlanId, &item.BitfeldId, &item.ServiceId, &item.Stop, &item.ArrivalTime, &item.DepartureTime, &item.VehicleType)

		item.TripId = item.Stop + item.ServiceId
		if err != nil {
			return nil, errors.New("failed to scan")
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
