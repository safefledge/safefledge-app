package database

import (
	"fmt"
	"os"
	"time"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
)

var db *gorm.DB
var err error

type SafetyRating struct {
	ID          int           `json:"id" gorm:"primaryKey"` //primary key
	Airline     string        `json:"airline"`
	Rating      float64       `json:"rating"`
	AlertLevel  string        `json:"alert_level"`
	OpinionData []OpinionData `json:"data" gorm:"many2many:airline_data;"`
	Accidents   []Accident    `json:"accidents" gorm:"many2many:accidents;"`
	CreatedAt   time.Time     `json:"created_at"`
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
	return
}

func GetRecordFromAirlineAccidents(airlineID int) ([]Accident, error) {
	var accidents []Accident
	err := db.Model(&Accident{}).Where("safety_rating_id = ?", airlineID).Find(&accidents).Error
	if err != nil {
		return nil, err
	} else {
		return accidents, nil
	}
}
