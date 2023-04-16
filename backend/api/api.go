package api

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

func home(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Hello World",
	})
}

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
	store := cookie.NewStore([]byte("secret"))
	store.Options(sessions.Options{
		MaxAge: 86400 * 7,
	})
	r.Use(sessions.Sessions("mysession", store))
	r.GET("/", home)
	return r
}
