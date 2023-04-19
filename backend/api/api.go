package api

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"safefledge.com/m/v2/database"
	"safefledge.com/m/v2/handler"
)

func home(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Hello World",
	})
}

///Data collection manually from aviation-safety.net

func scrapeWebSiteRequest(c *gin.Context) {
	website := "https://aviation-safety.net/database/"
	page := c.Query("page")
	if page == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Page number is required",
		})
	} else {
		accident, _ := handler.ScrapeWebsite(website, page)
		if accident == nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Error in scraping website",
			})
		} else {
			airline, err := database.CreateOrGetAirlineInDatabaseByName(accident.AirlineName)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"message": "Error in creating airline",
				})
			}
			accidentDB := &database.Accident{
				AirlineName:         accident.AirlineName,
				TotalPassengers:     accident.TotalPassengers,
				TotalFatalities:     accident.TotalFatalities,
				AircraftDamage:      accident.AircraftDamage,
				Location:            accident.Location,
				PhaseOfFlight:       accident.PhaseOfFlight,
				AccidentDescription: accident.AccidentDescription,
				SafetyRatingID:      airline.ID,
			}
			database.AddRecordToAirlineAccidents(airline, accidentDB)
			c.JSON(http.StatusOK, gin.H{
				"message": "Record created",
			})

		}
	}

}

func getRecordFromAccidients(c *gin.Context) {
	airlineID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Airline ID is required",
		})
	}
	record, err := database.GetRecordFromAirlineAccidents(airlineID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
	} else if record == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "No record found",
		})
	} else {
		fmt.Printf("%+v", record)
		c.JSON(http.StatusOK, gin.H{
			"message": "Record found",
		})
	}

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

	//Data collection manually from aviation-safety.net
	authGroup := r.Group("/api/v2").Use(handler.NoAuthRequired())
	authGroup.GET("/scrape", scrapeWebSiteRequest)
	authGroup.GET("/record/:id", getRecordFromAccidients)

	return r
}
