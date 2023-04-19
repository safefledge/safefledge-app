package handler

import "github.com/gin-gonic/gin"

func NoAuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
	}
}
