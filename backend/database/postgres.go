package database

import (
	"errors"
	"fmt"
	"log"
	"math"
	"os"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
	databaselib "safefledge.com/m/v2/database/database_lib"
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
	Rating                     float64       `json:"rating" gorm:"default:5.0;check:rating >= 0"`
	AlertLevel                 string        `json:"alert_level" gorm:"default:'No safety issues'"`
	OpinionData                []OpinionData `json:"data" gorm:"many2many:airline_data;"`
	Accidents                  []Accident    `json:"accidents" gorm:"many2many:accidents;"`
	CreatedAt                  time.Time     `json:"created_at"`
	UpdatedAt                  time.Time     `json:"updated_at"`
}

type Factor struct {
	Name      string
	Value     float64
	Weight    float64
	MaxValue  float64
	Normalize bool
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
	Username     string    `json:"username"`
	Password     string    `json:"password"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Subscription string    `json:"subscription" gorm:"default:'free'"` //free, premium, admin
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
				var AvFleetAge = airline.AvFleetAge
				var AircraftOver25 = float64(airline.AircraftOver25)
				var TotalAircrafts = float64(airline.TotalAircrafts)
				var Routes = float64(airline.Routes)
				var AnnualFlights = float64(airline.AnnualFlights)
				var Accidents5yrs = float64(airline.Accidents5yrs)
				var AccidentsFatalities5yrs = float64(airline.AccidentsFatalities5yrs)

				var factors = []Factor{
					{Name: "AvFleetAge", Value: AvFleetAge, Weight: 0.15, MaxValue: 40, Normalize: true},
					{Name: "AircraftOver25", Value: AircraftOver25, Weight: 0.05, MaxValue: 40},
					{Name: "TotalAircrafts", Value: TotalAircrafts, Weight: 0.05, MaxValue: 1000},
					{Name: "Routes", Value: Routes, Weight: 0.1, MaxValue: 10000},
					{Name: "AnnualFlights", Value: AnnualFlights, Weight: 0.15, MaxValue: 1000000},
					{Name: "Accidents5yrs", Value: Accidents5yrs, Weight: 0.4, MaxValue: 30},
					{Name: "AccidentsFatalities5yrs", Value: AccidentsFatalities5yrs, Weight: 0.1, MaxValue: 1000},
				}
				var safetyRating float64
				for i := range factors {
					if factors[i].Normalize {
						factors[i].Value = factors[i].Value / factors[i].MaxValue
					}
				}
				for _, f := range factors {
					safetyRating += f.Value * f.Weight
				}

				var ratingAfter = safetyRating * 5 / 4
				var mainRating float64
				safetyRatingRound := math.Round(ratingAfter*100) / 100
				mainRating = databaselib.AssignMainRating(safetyRatingRound)
				db.Model(&airline).Update("updated_at", time.Now())
				if mainRating <= 5 && mainRating >= 4.5 {
					if err := db.Model(&airline).Update("rating", mainRating).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					if err := db.Model(airline).Update("alert_level", "No major safety concerns").Error; err != nil {
						log.Println("failed to update alert level:", err)
						continue
					}

				} else if mainRating <= 4.5 && mainRating >= 4 {
					if err := db.Model(&airline).Update("rating", mainRating).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					if err := db.Model(airline).Update("alert_level", "No major safety concerns").Error; err != nil {
						log.Println("failed to update alert level:", err)
						continue
					}
				} else if mainRating <= 4 && mainRating >= 3.5 {
					if err := db.Model(&airline).Update("rating", mainRating).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					if err := db.Model(airline).Update("alert_level", "Minor safety concerns").Error; err != nil {
						log.Println("failed to update alert level:", err)
						continue
					}
				} else if mainRating <= 3.5 && mainRating >= 3 {
					if err := db.Model(&airline).Update("rating", mainRating).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					if err := db.Model(airline).Update("alert_level", "Major safety concerns").Error; err != nil {
						log.Println("failed to update alert level:", err)
						continue
					}
				} else if mainRating <= 3 && mainRating >= 2.5 {
					if err := db.Model(&airline).Update("rating", mainRating).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					if err := db.Model(airline).Update("alert_level", "Major safety concerns").Error; err != nil {
						log.Println("failed to update alert level:", err)
						continue
					}
				} else if mainRating <= 2.5 && mainRating >= 2 {
					if err := db.Model(&airline).Update("rating", mainRating).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					if err := db.Model(airline).Update("alert_level", "Major safety concerns").Error; err != nil {
						log.Println("failed to update alert level:", err)
						continue
					}
				} else if mainRating <= 2 && mainRating >= 1.5 {
					if err := db.Model(&airline).Update("rating", mainRating).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					if err := db.Model(airline).Update("alert_level", "Major safety concerns").Error; err != nil {
						log.Println("failed to update alert level:", err)
						continue
					}
				} else if mainRating <= 1.5 && mainRating >= 1 {
					if err := db.Model(&airline).Update("rating", mainRating).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					if err := db.Model(airline).Update("alert_level", "Major safety concerns").Error; err != nil {
						log.Println("failed to update alert level:", err)
						continue
					}
				} else if mainRating <= 1 && mainRating >= 0.5 {
					if err := db.Model(&airline).Update("rating", mainRating).Error; err != nil {
						log.Println("failed to update safety rating:", err)
						continue
					}
					if err := db.Model(airline).Update("alert_level", "Major safety concerns").Error; err != nil {
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

func CreateUser(user *User) (*User, error) {
	var existingUser User
	result := db.Where("email = ?", user.Email).First(&existingUser)
	if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("user with email %s already exists", user.Email)
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	user.Password = string(hashedPassword)
	result = db.Create(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return user, nil
}

func GetUserByEmail(email string) (*User, error) {
	var user User
	result := db.Where("email = ?", email).First(&user)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("user with email %s does not exist", email)
	}
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

func GetUserByID(id int) (*User, error) {
	var user User
	result := db.Where("id = ?", id).First(&user)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("user with id %d does not exist", id)
	}
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

func UpdateUser(user *User) (*User, error) {
	result := db.Save(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return user, nil
}

func DeleteUser(user *User) error {
	result := db.Delete(&user)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func LoginUser(email string, password string) (*User, error) {
	user, err := GetUserByEmail(email)
	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, fmt.Errorf("invalid password")
	}

	return user, nil
}
