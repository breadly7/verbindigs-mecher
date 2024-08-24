package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"github.com/verbindigs-mecher/internal/web"
)

func main() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
	}))

	apiGroup := r.Group("/api")
	web.RegisterStatusRoutes(apiGroup)
	web.RegisterScheduleRoutes(apiGroup)

	err := r.Run("localhost:8080")
	if err != nil {
		return
	}
}
