package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
)

var db *gorm.DB
var err error

type SafetyRating struct {
	ID                int           `json:"id" gorm:"primaryKey"` //primary key
	Airline           string        `json:"airline"`
	Rating            float64       `json:"rating" gorm:"default:5.0"`
	AlertLevel        string        `json:"alert_level" gorm:"default:'No safety issues'"`
	OpinionData       []OpinionData `json:"data" gorm:"many2many:airline_data;"`
	Accidents         []Accident    `json:"accidents" gorm:"many2many:accidents;"`
	NumberOfAccidents int           `json:"number_of_accidents"`
	CreatedAt         time.Time     `json:"created_at"`
	UpdatedAt         time.Time     `json:"updated_at"`
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

func getEnvVariable(key string) string {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
	return os.Getenv(key)
}

func ConnectPostgresDB() {
	var (
		host     = getEnvVariable("DB_HOST")
		port     = getEnvVariable("DB_PORT")
		user     = getEnvVariable("DB_USER")
		password = getEnvVariable("DB_PASS")
		dbname   = getEnvVariable("DB_NAME")
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
		airline.Airline = airlineName
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
	err = CalculateSafetyRating(airline)
	if err != nil {
		log.Fatal(err)
	}
	return
}

func CalculateSafetyRating(airline *SafetyRating) (err error) {
	var accidents []Accident
	err = db.Model(&Accident{}).Where("safety_rating_id = ?", airline.ID).Find(&accidents).Error
	if err != nil {
		return err
	}
	var totalFatalities int
	var totalPassengers int
	var safetyRating float64
	for _, accident := range accidents {
		totalFatalities += accident.TotalFatalities
		totalPassengers += accident.TotalPassengers
	}
	fatalRate := float64(totalFatalities) / float64(totalPassengers)
	incidentRate := float64(len(accidents)) / float64(totalPassengers)
	safetyRating = 5.0 - (fatalRate * 5.0) - (incidentRate * 5.0)
	if err := db.Model(airline).Update("rating", safetyRating).Error; err != nil {
		return err
	}
	db.Model(airline).Update("updated_at", time.Now())
	db.Model(airline).Update("number_of_accidents", len(accidents))
	if safetyRating > 3.0 {
		if err := db.Model(airline).Update("alert_level", "No safety issues").Error; err != nil {
			return err
		}
	} else if safetyRating > 2.0 {
		if err := db.Model(airline).Update("alert_level", "Minor safety issues").Error; err != nil {
			return err
		}
	} else if safetyRating > 1.0 {
		if err := db.Model(airline).Update("alert_level", "Major safety issues").Error; err != nil {
			return err
		}
	} else {
		if err := db.Model(airline).Update("alert_level", "Critical safety issues").Error; err != nil {
			return err
		}
	}
	return
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
