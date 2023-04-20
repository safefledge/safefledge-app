package lib

import (
	"os"
)

func CheckEnviroment() (enviroment string) {
	if os.Getenv("ENV") == "production" {
		return "production"
	}
	return "development"
}
