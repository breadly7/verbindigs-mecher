package tripcomparator

import (
	"github.com/verbindigs-mecher/internal/models"
)

func CompareTrips(plannedTrips *[]models.Trip, constructionTrips *[]models.Trip) {
	for _, plannedTrip := range *plannedTrips {
		print(plannedTrip.StopId)
	}
}
