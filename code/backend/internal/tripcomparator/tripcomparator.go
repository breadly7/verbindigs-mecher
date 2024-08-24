package tripcomparator

import (
	"github.com/verbindigs-mecher/internal/models"
	"time"
)

func CompareTrips(plannedTrips *[]models.Trip, constructionTrips *[]models.Trip, dayInYear int) *[]models.Diff {
	diffs := make([]models.Diff, 0)

	for _, plannedTrip := range *plannedTrips {
		tripFound := false

		for _, constructionTrip := range *constructionTrips {
			if plannedTrip.PreviousStopId == constructionTrip.PreviousStopId {
				if plannedTrip.ArrTime == constructionTrip.ArrTime {
					tripFound = true
				}
			}

		}

		if !tripFound {
			newDiff := models.Diff{
				Date:               time.Date(2023, 12, 10, 0, 0, 0, 0, time.Local).AddDate(0, 0, dayInYear),
				TrainNumber:        plannedTrip.TrainNumber,
				TrainLine:          plannedTrip.VehicleType + plannedTrip.ServiceLine,
				PlannedArrivalTime: plannedTrip.ArrTime,
				PreviousStop:       plannedTrip.PreviousStopName,
				TrainLineStops:     plannedTrip.TrainLineStops,
				Agency:             plannedTrip.Agency,
			}

			diffs = append(diffs, newDiff)
		}
	}

	return &diffs
}
