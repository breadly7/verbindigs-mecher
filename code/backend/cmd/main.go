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

	stationId := "8507483"
	stationName := "Spiez"
	dayInYear := 93

	plannedTrips, err := triploader.Loadtrips("./db/construction_schedule.sqlite", stationId, dayInYear)

	if err != nil {
		println(err.Error())
		return
	}

	constructionTrips, err := triploader.Loadtrips("./db/planned_schedule.sqlite", stationId, dayInYear)
	if err != nil {
		println(err.Error())
		return
	}

	r.GET("/api/schedule/diffs", func(c *gin.Context) {
		stationDiffs := make([]models.StationDiff, 1)
		stationDiffs[0] = models.StationDiff{
			Name:        stationName,
			Differences: *tripcomparator.CompareTrips(plannedTrips, constructionTrips, dayInYear),
		}
		c.JSON(http.StatusOK, stationDiffs)
	})

	err = r.Run("localhost:8080")
	if err != nil {
		return
	}
}
