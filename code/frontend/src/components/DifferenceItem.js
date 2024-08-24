import React from 'react';

import formatTime from '../utils/formatTime';
import Accordion from './Accordion';

const DifferenceItem = ({ difference }) => {
	return (
		<Accordion title={`${difference.TrainLine} from ${difference.PreviousStop} at ${formatTime(difference.PlannedArrivalTime)} [${difference.TrainNumber}]`} itemCount={difference.TrainLineStops.length}>
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
		</Accordion>
	);
};

export default DifferenceItem;