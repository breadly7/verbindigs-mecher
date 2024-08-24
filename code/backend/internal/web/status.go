package web

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterStatusRoutes(r *gin.RouterGroup) {
	r.GET("/status", statusEndpoint)
}

func statusEndpoint(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "healthy",
	})
}
