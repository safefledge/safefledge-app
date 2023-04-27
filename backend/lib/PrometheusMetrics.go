package lib

import (
	"github.com/prometheus/client_golang/prometheus"
)

var SafetyRatingsCounter = prometheus.NewCounter(prometheus.CounterOpts{
	Name: "safety_ratings_counter",
	Help: "Number of safety ratings",
})

func AddSafetyRatingsCounter() {
	SafetyRatingsCounter.Inc()
}

/*func init() {
	prometheus.MustRegister(SafetyRatingsCounter)
	http.Handle("/metrics", promhttp.Handler())
	go http.ListenAndServe(":8080", nil)
}
*/
