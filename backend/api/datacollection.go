package api

import (
	"fmt"
	"time"

	"github.com/jinzhu/gorm"
)

type SafetyRating struct {
	ID         int       `json:"id"`
	Airline    string    `json:"airline"`
	Rating     float64   `json:"rating"`
	AlertLevel string    `json:"alert_level"`
	Data       []Data    `json:"data" gorm:"many2many:airline_data;"`
	CreatedAt  time.Time `json:"created_at"`
}

type Data struct {
	ID          int        `json:"id"`
	AirlineCode string     `json:"airline_code"`
	AirlineName string     `json:"airline_name"`
	Data        []DataUnit `json:"data" gorm:"foreigkey:AirlineID;"`
	Source      string     `json:"source"`
	CreatedAt   time.Time  `json:"created_at"`
}

type DataUnit struct {
	ID          int    `json:"id"`
	AirlineID   int    `json:"airline_id" gorm:"foreigkey:ID;"`
	DataType    string `json:"data_type"`
	Year        int    `json:"year"`
	DataDecoded []struct {
		AccidentCount             int `json:"accident_count"`
		OpinionCount              int `json:"opinion_count"`
		OpinionRating             int `json:"opinion_rating"`
		OpinionPositive           int `json:"opinion_positive"`
		OpinionNegative           int `json:"opinion_negative"`
		OpinionNeutral            int `json:"opinion_neutral"`
		AirlineAircraftAverageAge int `json:"airline_aircraft_average_age"`
	}
}

type APIResponse struct {
	Results []struct {
		Airline struct {
			Name string `json:"name"`
			Iata string `json:"iata"`
			Icao string `json:"icao"`
		} `json:"airline"`
		DataType string `json:"data_type"`
		Data     []struct {
			Year        int `json:"year"`
			DataDecoded []struct {
				AccidentCount             int `json:"accident_count"`
				OpinionCount              int `json:"opinion_count"`
				OpinionRating             int `json:"opinion_rating"`
				OpinionPositive           int `json:"opinion_positive"`
				OpinionNegative           int `json:"opinion_negative"`
				OpinionNeutral            int `json:"opinion_neutral"`
				AirlineAircraftAverageAge int `json:"airline_aircraft_average_age"`
			} `json:"data_decoded"`
		}
	}
}

func getAirlineDataOrCreate(db *gorm.DB, iata string, name string) (*Data, error) {
	airline := &Data{}
	if err := db.Where("airline_code = ?", iata).First(airline).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			airline.AirlineCode = iata
			airline.AirlineName = name
			if err := db.Create(airline).Error; err != nil {
				return nil, fmt.Errorf("error while creating new airline: %v", err)
			}
		} else {
			return nil, fmt.Errorf("error while getting airline: %v", err)
		}
	}
	return airline, nil
}
