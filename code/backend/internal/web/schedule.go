package web

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/verbindigs-mecher/internal/models"
	"github.com/verbindigs-mecher/internal/tripcomparator"
	"github.com/verbindigs-mecher/internal/triploader"
)

func RegisterScheduleRoutes(r *gin.RouterGroup) {
	scheduleGroup := r.Group("/schedule")
	scheduleGroup.GET("/diffs", scheduleDiffsEndpoint)
}

func scheduleDiffsEndpoint(c *gin.Context) {
	stationIds := []string{"8507483", "8507000", "8503000"}
	stationNames := []string{"Spiez", "Bern", "Zürich HB"}

	stationDiffs := make([]models.StationDiff, 0)
	for i := range stationIds {
		stationDiffsOnDay := make([]models.Diff, 0)
		for y := range 366 {
			plannedTrips, err := triploader.Loadtrips("./db/planned_schedule.sqlite", stationIds[i], y)

			if err != nil {
				println(err.Error())
				return
			}

			constructionTrips, err := triploader.Loadtrips("./db/construction_schedule.sqlite", stationIds[i], y)
			if err != nil {
				println(err.Error())
				return
			}

			diffsOnDay := tripcomparator.CompareTrips(plannedTrips, constructionTrips, y)
			if len(*diffsOnDay) == 0 {
				continue
			}

			stationDiffsOnDay = append(stationDiffsOnDay, *diffsOnDay...)

		}
		stationDiffs = append(stationDiffs, models.StationDiff{
			Name:        stationNames[i],
			Differences: stationDiffsOnDay,
		})
	}
	c.JSON(http.StatusOK, stationDiffs)
}
