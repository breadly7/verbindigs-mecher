package models

import "time"

type Trip struct {
	StopName         string
	StopId           string
	TrainNumber      string
	VehicleType      string
	ServiceLine      string
	PreviousStopName string
	PreviousStopId   string
	DepTime          string
	ArrTime          string
	Content          string
	Agency           string
	TrainLineStops   []LineStop
	DayInYear        int
}

type StationDiff struct {
	Name              string
	DifferencesPerDay []DayDiff
}

type LineStop struct {
	StopId   string
	StopName string
	DepTime  string
	ArrTime  string
}

type DayDiff struct {
	Date        time.Time
	Differences []Diff
}
type Diff struct {
	TrainNumber        string
	TrainLine          string
	PlannedArrivalTime string
	PreviousStop       string
	TrainLineStops     []LineStop
	Agency             string
	AlternateTrain     *Trip
}

type Stop struct {
	Name string
	Id   string
}

type MissedConnection struct {
	StopName            string
	StopDeparture       string
	WalkMinutes         int
	DestinationStopName string
	Agency              string
}
