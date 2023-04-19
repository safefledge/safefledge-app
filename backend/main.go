package main

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"safefledge.com/m/v2/api"
	"safefledge.com/m/v2/database"
	"safefledge.com/m/v2/lib"
)

func init() {
	gin.SetMode(gin.ReleaseMode)
	database.ConnectPostgresDB()
}

func main() {
	enviroment := lib.CheckEnviroment()
	if enviroment == "production" {
		viper.SetConfigFile("ENV")
		viper.ReadInConfig()
		viper.AutomaticEnv()
		port := viper.Get("PORT")
		r := api.SetupRouter()
		r.Run(":" + port.(string))
	} else {
		r := api.SetupRouter()
		r.Run(":5000")
	}
}
