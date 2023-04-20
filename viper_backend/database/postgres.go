package database

import (
	"fmt"
	"log"
	"math"
	"os"
	"time"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

var db *gorm.DB
var err error

type SafetyRating struct {
	ID                         int           `json:"id" gorm:"primaryKey"` //primary key
	OperatorName               string        `json:"operator_name"`
	OperatorCode               string        `json:"operator_code"`
	CountryName                string        `json:"country_name"`
	CountryCode                string        `json:"country_code"`
	AvFleetAge                 float64       `json:"av_fleet_age"`                 //average fleet age
	AircraftOver25             int           `json:"aircraft_over_25"`             //number of aircraft over 25 years old
	TotalAircrafts             int           `json:"total_aircrafts"`              //number of aircrafts
	Routes                     int           `json:"routes"`                       //number of routes
	Connections                int           `json:"connections"`                  //number of connections
	Desinations                int           `json:"destinations"`                 //number of destinations
	AnnualFlights              int           `json:"annual_flights"`               //number of annual flights
	AnnualInternationalFlights int           `json:"annual_international_flights"` //number of annual international flights
	Accidents5yrs              int           `json:"accidents_5yrs"`               //number of accidents in the last 5 years
	AccidentsFatalities5yrs    int           `json:"accidents_fatalities_5yrs"`    //number of fatalities in the last 5 years
	Rating                     float64       `json:"rating" gorm:"default:5.0"`
	AlertLevel                 string        `json:"alert_level" gorm:"default:'No safety issues'"`
	OpinionData                []OpinionData `json:"data" gorm:"many2many:airline_data;"`
	Accidents                  []Accident    `json:"accidents" gorm:"many2many:accidents;"`
	CreatedAt                  time.Time     `json:"created_at"`
	UpdatedAt                  time.Time     `json:"updated_at"`
}

type OpinionData struct {
	ID        int       `json:"id"`
	Opinion   string    `json:"opinion"`
	Count     int       `json:"count"`
	CreatedAt time.Time `json:"created_at"`
}
type Accident struct {
	AirlineName         string        `json:"airline_name"`
	TotalPassengers     int           `json:"total_passengers"`
	TotalFatalities     int           `json:"total_fatalities"`
	AircraftDamage      string        `json:"aircraft_damage"`
	Location            string        `json:"location"`
	PhaseOfFlight       string        `json:"phase_of_flight"`
	AccidentDescription string        `json:"accident_description"`
	SafetyRatingID      int           `json:"safety_rating_id"`
	SafetyRating        *SafetyRating `json:"safety_rating" gorm:"many2many:accidents"`
}

type User struct {
	ID           uint      `gorm:"primary_key"`
	Email        string    `gorm:"unique" json:"email"`
	Username     string    `gorm:"unique" json:"username"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Subscription string    `json:"subscription"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Email struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	Body    string `json:"body"`
}

func getEnvVariable(key string) string {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
	return os.Getenv(key)
}

func ConnectPostgresDB() {
	viper.SetConfigFile("ENV")
	viper.ReadInConfig()
	viper.AutomaticEnv()
	var (
		host     = viper.Get("DB_HOST")
		port     = viper.Get("DB_PORT")
		user     = viper.Get("DB_USER")
		password = viper.Get("DB_PASS")
		dbname   = viper.Get("DB_NAME")
	)
	connection := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=require", host, port, user, dbname, password)

	db, err = gorm.Open("postgres", connection)
	if err != nil {
		panic(err)
	}
	db.AutoMigrate(&SafetyRating{}, &User{}, &OpinionData{}, &Accident{})
}

func GetDB() *gorm.DB {
	return db
}

func CreateOrGetAirlineInDatabaseByName(airlineName string) (airline *SafetyRating, err error) {
	airline = &SafetyRating{}
	err = db.Where("airline = ?", airlineName).First(airline).Error
	if err != nil {
		if !gorm.IsRecordNotFoundError(err) {
			return nil, err
		}
		airline.OperatorName = airlineName
		err = db.Create(airline).Error
		if err != nil {
			return nil, err
		}
	}
	return
}

///New airline get or create function

func NewCreateOrGetAirline(airline *SafetyRating) (airline2 *SafetyRating, err error) {
	airline2 = &SafetyRating{}
	err = db.Where("operator_name = ?", airline.OperatorName).First(airline2).Error
	if err != nil {
		if !gorm.IsRecordNotFoundError(err) {
			return nil, err
		}
		err = db.Create(airline).Error
		if err != nil {
			return nil, err
		}
	}
	return
}

func AddRecordToAirlineAccidents(airline *SafetyRating, data *Accident) (err error) {
	err = db.Model(airline).Association("Accidents").Append(data).Error
	if err != nil {
		return err
	}
	return
}

func NewUpdateSafetyRatings() {
	ticker := time.NewTicker(time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		var airlines []SafetyRating
		if err := db.Find(&airlines).Error; err != nil {
			log.Println("falied to retrieve airlines:", err)
			continue
		}
		for _, airline := range airlines {
			var accidents []Accident
			if err := db.Model(&Accident{}).Where("safety_rating_id = ?", airline.ID).Find(&accidents).Error; err != nil {
				log.Println("failed to retrieve accidents:", err)
				continue
			}
			if len(accidents) == 0 {
				var acfTotal = airline.TotalAircrafts
				var avFleetAge = airline.AvFleetAge
				var accidents_5y = airline.Accidents5yrs
				if accidents_5y == 0 && avFleetAge <= 10 {
					if err := db.Model(&airline).Update("safety_rating", "5.0").Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					db.Model(&airline).Update("updated_at", time.Now())
					if err := db.Model(airline).Update("alert_level", "No major accidents in the last 5 years").Error; err != nil {
						log.Println("failed to update alert level:", err)
						continue
					}

				}
				var fatal_5y = airline.AccidentsFatalities5yrs
				var fatal_5y_percent = float64(fatal_5y) / float64(accidents_5y)
				var fatal_5y_percent_rounded = math.Round(fatal_5y_percent*100) / 100
				if avFleetAge <= 5 {
					var safetyRating = 5.0 - (float64(accidents_5y) * 0.5) - (float64(acfTotal) * 0.1) - (float64(avFleetAge) * 0.1) - (float64(fatal_5y_percent_rounded) * 0.3)
					var safetyRatingRounded = math.Round(safetyRating*100) / 100

					if err := db.Model(&airline).Update("rating", safetyRatingRounded).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					db.Model(&airline).Update("updated_at", time.Now())
				} else if avFleetAge > 5 && avFleetAge <= 10 {
					var safetyRating = 5.0 - (float64(accidents_5y) * 0.5) - (float64(fatal_5y_percent_rounded) * 0.3)
					var safetyRatingRounded = math.Round(safetyRating*100) / 100
					if err := db.Model(&airline).Update("rating", safetyRatingRounded).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					db.Model(&airline).Update("updated_at", time.Now())
					if safetyRating > 4.5 {
						if err := db.Model(airline).Update("alert_level", "No major safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 4.5 && safetyRating > 4.0 {
						if err := db.Model(airline).Update("alert_level", "Minor safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 4.0 && safetyRating > 3.5 {
						if err := db.Model(airline).Update("alert_level", "Moderate safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 3.5 && safetyRating > 3.0 {
						if err := db.Model(airline).Update("alert_level", "Major safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 3.0 {
						if err := db.Model(airline).Update("alert_level", "Critical safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
				} else if avFleetAge > 10 && avFleetAge <= 15 {
					var safetyRating = 5.0 - (float64(accidents_5y) * 0.5) - (float64(avFleetAge) * 0.1) - (float64(fatal_5y_percent_rounded) * 0.3)
					var safetyRatingRounded = math.Round(safetyRating*100) / 100
					if err := db.Model(&airline).Update("rating", safetyRatingRounded).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					db.Model(&airline).Update("updated_at", time.Now())
					if safetyRating > 4.5 {
						if err := db.Model(airline).Update("alert_level", "No major safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 4.5 && safetyRating > 4.0 {
						if err := db.Model(airline).Update("alert_level", "Minor safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 4.0 && safetyRating > 3.5 {
						if err := db.Model(airline).Update("alert_level", "Moderate safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 3.5 && safetyRating > 3.0 {
						if err := db.Model(airline).Update("alert_level", "Major safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 3.0 {
						if err := db.Model(airline).Update("alert_level", "Critical safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
				} else if avFleetAge > 15 && avFleetAge <= 20 {
					var safetyRating = 5.0 - (float64(accidents_5y) * 0.5) - (float64(avFleetAge) * 0.4) - (float64(fatal_5y_percent_rounded) * 0.3)
					var safetyRatingRounded = math.Round(safetyRating*100) / 100
					if err := db.Model(&airline).Update("rating", safetyRatingRounded).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					db.Model(&airline).Update("updated_at", time.Now())
					if safetyRating > 4.5 {
						if err := db.Model(airline).Update("alert_level", "No major safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 4.5 && safetyRating > 4.0 {
						if err := db.Model(airline).Update("alert_level", "Minor safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 4.0 && safetyRating > 3.5 {
						if err := db.Model(airline).Update("alert_level", "Moderate safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 3.5 && safetyRating > 3.0 {
						if err := db.Model(airline).Update("alert_level", "Major safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 3.0 {
						if err := db.Model(airline).Update("alert_level", "Critical safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
				} else if avFleetAge > 20 && avFleetAge <= 25 {
					var safetyRating = 5.0 - (float64(accidents_5y) * 0.5) - (float64(acfTotal) * 0.1) - (float64(avFleetAge) * 0.5) - (float64(fatal_5y_percent_rounded) * 0.3)
					var safetyRatingRounded = math.Round(safetyRating*100) / 100
					if err := db.Model(&airline).Update("rating", safetyRatingRounded).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					db.Model(&airline).Update("updated_at", time.Now())
					if safetyRating > 4.5 {
						if err := db.Model(airline).Update("alert_level", "No major safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 4.5 && safetyRating > 4.0 {
						if err := db.Model(airline).Update("alert_level", "Minor safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 4.0 && safetyRating > 3.5 {
						if err := db.Model(airline).Update("alert_level", "Moderate safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 3.5 && safetyRating > 3.0 {
						if err := db.Model(airline).Update("alert_level", "Major safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 3.0 {
						if err := db.Model(airline).Update("alert_level", "Critical safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
				} else if avFleetAge > 25 && avFleetAge <= 30 {
					var safetyRating = 5.0 - (float64(accidents_5y) * 0.5) - (float64(acfTotal) * 0.1) - (float64(avFleetAge) * 0.6) - (float64(fatal_5y_percent_rounded) * 0.3)
					var safetyRatingRounded = math.Round(safetyRating*100) / 100
					if err := db.Model(&airline).Update("rating", safetyRatingRounded).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					db.Model(&airline).Update("updated_at", time.Now())
					if safetyRating > 4.5 {
						if err := db.Model(airline).Update("alert_level", "No major safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 4.5 && safetyRating > 4.0 {
						if err := db.Model(airline).Update("alert_level", "Minor safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 4.0 && safetyRating > 3.5 {
						if err := db.Model(airline).Update("alert_level", "Moderate safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 3.5 && safetyRating > 3.0 {
						if err := db.Model(airline).Update("alert_level", "Major safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 3.0 {
						if err := db.Model(airline).Update("alert_level", "Critical safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
				} else if avFleetAge > 30 && avFleetAge <= 35 {
					var safetyRating = 5.0 - (float64(accidents_5y) * 0.5) - (float64(acfTotal) * 0.1) - (float64(avFleetAge) * 0.7) - (float64(fatal_5y_percent_rounded) * 0.3)
					var safetyRatingRounded = math.Round(safetyRating*100) / 100
					if err := db.Model(&airline).Update("rating", safetyRatingRounded).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					db.Model(&airline).Update("updated_at", time.Now())
					if safetyRating > 4.5 {
						if err := db.Model(airline).Update("alert_level", "No major safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 4.5 && safetyRating > 4.0 {
						if err := db.Model(airline).Update("alert_level", "Minor safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 4.0 && safetyRating > 3.5 {
						if err := db.Model(airline).Update("alert_level", "Moderate safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 3.5 && safetyRating > 3.0 {
						if err := db.Model(airline).Update("alert_level", "Major safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
					if safetyRating <= 3.0 {
						if err := db.Model(airline).Update("alert_level", "Critical safety concerns").Error; err != nil {
							log.Println("failed to update alert level:", err)
							continue
						}
					}
				}
			} else {
				var totalFatalities int
				var totalPassengers int
				var safetyRating float64
				var acfTotal = airline.TotalAircrafts
				var avFleetAge = airline.AvFleetAge
				var acfOver25 = airline.AircraftOver25
				var acfOver25Percent = float64(acfOver25) / float64(acfTotal)
				var acfOver25PercentRounded = math.Round(acfOver25Percent*100) / 100
				var accidents_5y = airline.Accidents5yrs
				var fatal_5y = airline.AccidentsFatalities5yrs
				var fatal_5y_percent = float64(fatal_5y) / float64(accidents_5y)
				var fatal_5y_percent_rounded = math.Round(fatal_5y_percent*100) / 100

				for _, accident := range accidents {
					totalFatalities += accident.TotalFatalities
					totalPassengers += accident.TotalPassengers
				}

				fatalRate := float64(totalFatalities) / float64(totalPassengers)
				safetyRating = 5.0 - (fatalRate * 100) - (acfOver25PercentRounded * 2) - (avFleetAge * 0.5) - (fatal_5y_percent_rounded * 2)

				if err := db.Model(&airline).Update("rating", safetyRating).Error; err != nil {
					log.Println("failed to update safety rating:", err)
					continue
				}
				db.Model(&airline).Update("updated_at", time.Now())
				if safetyRating > 4.5 {
					if err := db.Model(airline).Update("alert_level", "No safety concerns").Error; err != nil {
						log.Println("failed to update alert level:", err)
						continue
					}
				}
				if safetyRating <= 4.5 && safetyRating > 3.5 {
					if err := db.Model(airline).Update("alert_level", "Minor safety concerns").Error; err != nil {
						log.Println("failed to update alert level:", err)
						continue
					}
				}
				if safetyRating <= 3.5 && safetyRating > 2.5 {
					if err := db.Model(airline).Update("alert_level", "Moderate safety concerns").Error; err != nil {
						log.Println("failed to update alert level:", err)
						continue
					}
				}
				if safetyRating <= 2.5 && safetyRating > 1.5 {
					if err := db.Model(airline).Update("alert_level", "Major safety concerns").Error; err != nil {
						log.Println("failed to update alert level:", err)
						continue
					}
				}
				if safetyRating <= 1.5 {
					if err := db.Model(airline).Update("alert_level", "Severe safety concerns").Error; err != nil {
						log.Println("failed to update alert level:", err)
						continue
					}
				}
			}
		}
	}
}

func GetRecordFromAirlineAccidents(airlineID int) ([]Accident, error) {
	var accidents []Accident
	err := db.Model(&Accident{}).Where("safety_rating_id = ?", airlineID).Find(&accidents).Error
	if err != nil {
		return nil, err
	} else {
		if len(accidents) == 0 {
			return nil, nil
		} else {
			return accidents, nil
		}
	}
}

func AddRecordToAirlineOpinionData(airline *SafetyRating, data *OpinionData) (err error) {
	err = db.Model(airline).Association("OpinionData").Append(data).Error
	if err != nil {
		return err
	}
	return
}

func GetRecordFromAirlineOpinionData(airlineID int) ([]OpinionData, error) {
	var opinions []OpinionData
	err := db.Model(&OpinionData{}).Where("safety_rating_id = ?", airlineID).Find(&opinions).Error
	if err != nil {
		return nil, err
	} else {
		if len(opinions) == 0 {
			return nil, nil
		} else {
			return opinions, nil
		}
	}
}
