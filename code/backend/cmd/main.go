package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/verbindigs-mecher/internal/models"
	"github.com/verbindigs-mecher/internal/tripcomparator"
	"github.com/verbindigs-mecher/internal/triploader"
	"net/http"
)

func main() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
	}))

	stationIds := []string{"8507483", "8507000", "8503000"}
	stationNames := []string{"Spiez", "Bern", "Zürich HB"}

	r.GET("/api/schedule/diffs", func(c *gin.Context) {
		stationDiffs := make([]models.StationDiff, 0)
		for i, _ := range stationIds {
			stationDiffsOnDay := make([]models.Diff, 0)
			for y := range 366 {
				plannedTrips, err := triploader.Loadtrips("./db/construction_schedule.sqlite", stationIds[i], y)

				if err != nil {
					println(err.Error())
					return
				}

				constructionTrips, err := triploader.Loadtrips("./db/planned_schedule.sqlite", stationIds[i], y)
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
	})

	err := r.Run("localhost:8080")
	if err != nil {
		return
	}
}
