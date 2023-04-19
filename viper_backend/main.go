package main

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"safefledge.com/m/v2/api"
	"safefledge.com/m/v2/database"
)

func init() {
	gin.SetMode(gin.ReleaseMode)
	database.ConnectPostgresDB()
	go database.NewUpdateSafetyRatings()
}

func main() {
	viper.SetConfigFile("ENV")
	viper.ReadInConfig()
	viper.AutomaticEnv()
	port := viper.Get("PORT")
	r := api.SetupRouter()
	r.Run(":" + port.(string))
}
