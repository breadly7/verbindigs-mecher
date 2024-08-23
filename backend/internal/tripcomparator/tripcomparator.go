package tripcomparator

import (
	"github.com/verbindigs-mecher/internal/models"
	"slices"
)

func CompareTrips(plannedTrips *[]models.Trip, constructionTrips *[]models.Trip) {
	for _, plannedTrip := range *plannedTrips {
		i := slices.IndexFunc(*constructionTrips, func(t models.Trip) bool {
			return t.FPlanId == plannedTrip.FPlanId
		})
		if i >= 0 {
			matchingTrip := (*constructionTrips)[i]
			print(matchingTrip.TripId)
		}
	}
}
