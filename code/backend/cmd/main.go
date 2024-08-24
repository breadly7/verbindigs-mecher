package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/verbindigs-mecher/internal/tripcomparator"
	"github.com/verbindigs-mecher/internal/triploader"
	"net/http"
)

func main() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
	}))

	plannedTrips, err := triploader.Loadtrips("./db/construction_schedule.sqlite", "8507483", 93)

	if err != nil {
		println(err.Error())
		return
	}

	constructionTrips, err := triploader.Loadtrips("./db/planned_schedule.sqlite", "8507483", 93)
	if err != nil {
		println(err.Error())
		return
	}

	r.GET("/api/schedule/diffs", func(c *gin.Context) {
		diffs := tripcomparator.CompareTrips(plannedTrips, constructionTrips, 120)
		c.JSON(http.StatusOK, diffs)
	})

	err = r.Run("localhost:8080")
	if err != nil {
		return
	}
}
