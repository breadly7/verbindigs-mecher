package main

import (
	"github.com/verbindigs-mecher/internal/tripcomparator"
	"github.com/verbindigs-mecher/internal/triploader"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	r := gin.Default()

	plannedTrips, err := triploader.Loadtrips("./db/construction_schedule.sqlite")

	if err != nil {
		println(err.Error())
		return
	}

	constructionTrips, err := triploader.Loadtrips("./db/planned_schedule.sqlite")

	if err != nil {
		println(err.Error())
		return
	}

	tripcomparator.CompareTrips(plannedTrips, constructionTrips)

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	err = r.Run("localhost:8080")
	if err != nil {
		return
	}
}
