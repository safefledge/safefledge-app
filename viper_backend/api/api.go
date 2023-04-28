package api

import (
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"safefledge.com/m/v2/database"
	"safefledge.com/m/v2/handler"
)

func home(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Safe Fledge API",
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
	}
	if record != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "Record found",
		})
	}

}

func createAirline(c *gin.Context) {
	airline := &database.SafetyRating{}
	err := c.ShouldBindJSON(airline)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
	}
	airline, err = database.NewCreateOrGetAirline(airline)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Airline created",
	})
}

func createUser(c *gin.Context) {
	var user database.User
	err := c.BindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
	}
	db, err := database.CreateUser(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"message": "User created",
			"data":    db,
		})
	}
}

func loginUser(c *gin.Context) {
	var user database.User
	err := c.BindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
	}
	db, err := database.LoginUser(user.Email, user.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"message": "User logged in",
			"data":    db,
		})
	}
}

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://safefledge.com", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
	viper.SetConfigFile("ENV")
	viper.ReadInConfig()
	viper.AutomaticEnv()
	secret := viper.GetString("SESSION_SECRET")
	store := cookie.NewStore([]byte(secret))
	store.Options(sessions.Options{
		MaxAge:   60 * 60 * 24 * 7,
		HttpOnly: true,
		Path:     "/", //Cookie path
	})
	r.Use(sessions.Sessions("usersession", store))

	r.GET("/", home)

	r.GET("/v2/redistest", func(c *gin.Context) {
		session := sessions.Default(c)
		session.Set("key", "value")
		session.Save()
		c.JSON(http.StatusOK, gin.H{
			"message": "Redis test",
		})
	})

	//Data collection manually from aviation-safety.net
	authGroup := r.Group("/v2").Use(handler.AuthRequiredAdmin())
	authGroup.GET("/scrape", scrapeWebSiteRequest)
	authGroup.GET("/record/:id", getRecordFromAccidients)
	authGroup.POST("/airline", createAirline)

	//User authentication and registration routes
	authGroupUser := r.Group("/v2")
	authGroupUser.POST("/register", createUser)
	authGroupUser.POST("/login", loginUser)

	return r
}
