package web

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterStatusRoutes(r *gin.RouterGroup, version string) {
	r.GET("/status", func(c *gin.Context) {
		statusEndpoint(c, version)
	})
}

func statusEndpoint(c *gin.Context, version string) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"version": version,
	})
}
