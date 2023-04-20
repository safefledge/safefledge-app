package databaselib

func AssignMainRating(safetyRating float64) float64 {
	var mainRating float64
	switch {
	case safetyRating <= 15000:
		mainRating = 5
	case safetyRating <= 30000:
		mainRating = 4
	case safetyRating <= 45000:
		mainRating = 3
	case safetyRating <= 60000:
		mainRating = 2
	case safetyRating >= 75000:
		mainRating = 1
	default:
		mainRating = 1
	}
	return mainRating
}
