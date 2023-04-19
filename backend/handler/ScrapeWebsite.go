package handler

import (
	"regexp"
	"strconv"
	"strings"

	"github.com/gocolly/colly/v2"
	"safefledge.com/m/v2/database"
)

func ScrapeWebsite(url string, page string) (*database.Accident, error) {
	var accident database.Accident
	newUrl := url + page
	c := colly.NewCollector()
	if c == nil {
		return &accident, nil
	}
	c.OnHTML("tr:has(td.caption:contains('Operator:')) td.desc a[href]", func(e *colly.HTMLElement) {
		accident.AirlineName = e.Text
	})
	c.OnHTML("tr", func(e *colly.HTMLElement) {
		caption := e.ChildText("td.caption")
		desc := e.ChildText("td.desc")
		if caption == "Total:" {
			regex := regexp.MustCompile(`Fatalities: (\d+) \/ Occupants: (\d+)`)
			matches := regex.FindStringSubmatch(desc)
			if len(matches) == 3 {
				fatalites, _ := strconv.Atoi(matches[1])
				occupants, _ := strconv.Atoi(matches[2])
				accident.TotalFatalities = fatalites
				accident.TotalPassengers = occupants
			}
		}
	})
	c.OnHTML("tr:has(td:contains('Aircraft damage:'))", func(e *colly.HTMLElement) {
		td := e.DOM.Find("td.desc")
		aircraftDamage := strings.TrimSpace(td.Text())
		accident.AircraftDamage = aircraftDamage
	})

	c.OnHTML("tr:has(td:contains('Location:'))", func(e *colly.HTMLElement) {
		td := e.DOM.Find("td.desc")
		location := strings.TrimSpace(td.Text())
		accident.Location = location
	})
	c.OnHTML("tr:has(td:contains('Phase:'))", func(e *colly.HTMLElement) {
		td := e.DOM.Find("td.desc")
		phase := strings.TrimSpace(td.Text())
		accident.PhaseOfFlight = phase
	})
	c.OnHTML("span.caption:contains('Narrative:')", func(e *colly.HTMLElement) {
		accident.AccidentDescription = e.DOM.Next().Siblings().Text()
	})
	c.Visit(newUrl)

	return &accident, nil

}
