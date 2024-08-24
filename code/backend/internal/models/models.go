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

type LineStop struct {
	StopId   string
	StopName string
	DepTime  string
	ArrTime  string
}

type Diff struct {
	DayInYear          int
	TrainNumber        string
	TrainLine          string
	PlannedArrivalTime string
	PreviousStop       string
	TrainLineStops     []LineStop
	Agency             string
}
