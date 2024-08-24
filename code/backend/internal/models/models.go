package models

type Trip struct {
	StopName         string
	StopId           string
	PreviousStopName string
	PreviousStopId   string
	DepTime          string
	ArrTime          string
	Content          string
}

type StationDiff struct {
	Name        string
	Differences []Diff
}

type Diff struct {
	DayInYear          int
	PlannedArrivalTime string
	PreviousStop       string
}
