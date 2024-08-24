import React from 'react';

const DifferenceItem = ({ difference }) => {
	return (
		<div className="p-4 bg-white rounded-lg shadow-md mb-4">
			<div className="flex justify-between items-center">
				<div className="flex-1 px-2">
					<strong>Day in year:</strong> {difference.DayInYear}
				</div>
				<div className="flex-1 px-2">
					<strong>Planned Arrival Time:</strong> {difference.PlannedArrivalTime}
				</div>
				<div className="flex-1 px-2">
					<strong>Previous stop:</strong> {difference.PreviousStop}
				</div>
			</div>
		</div>
	);
};

export default DifferenceItem;