package tripcomparator

import (
	"errors"

	"github.com/verbindigs-mecher/internal/models"
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

func FindAlternateTrain(agency string, trainNumber string, stopId string, constructionTrips *[]models.Trip, dayInYear int) (*models.Trip, error) {
	for _, constructionTrip := range *constructionTrips {
		if constructionTrip.StopId == stopId && constructionTrip.TrainNumber == trainNumber && constructionTrip.Agency == agency && constructionTrip.DayInYear == dayInYear {
			return &constructionTrip, nil
		}
	}
	return nil, errors.New("no alternate train found")
}
