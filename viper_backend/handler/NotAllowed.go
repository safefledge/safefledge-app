package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func NotAllowed() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusMethodNotAllowed, gin.H{
			"message": "Method not allowed",
		})
		c.Abort()
	}
}
