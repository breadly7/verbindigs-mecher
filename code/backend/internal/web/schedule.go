package web

import (
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
