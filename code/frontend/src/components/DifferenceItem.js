import React from 'react';

import formatTime from '../utils/formatTime';
import Accordion from './Accordion';

const DifferenceItem = ({ difference }) => {
	return (
		<Accordion title={`${new Date(difference.Date).toLocaleDateString()} - ${difference.TrainLine} [${difference.TrainNumber}] from ${difference.PreviousStop} at ${formatTime(difference.PlannedArrivalTime)}`} itemCount={difference.TrainLineStops.length + ' stops'}>
			<ul>
				<li><strong>Agency</strong>: {difference.Agency}</li>
				{difference.TrainLineStops.map((stop, index) => (
					<li key={index}>
						<strong>Stop</strong>: {stop.StopName} -
						<strong> Arrival</strong>: {stop.ArrTime ? formatTime(stop.ArrTime) : 'N/A'} -
						<strong> Departure</strong>: {stop.DepTime ? formatTime(stop.DepTime) : 'N/A'}
					</li>
				))}
			</ul>

		</Accordion>
	);
};

export default DifferenceItem;