import React from 'react';

import formatTime from '../utils/formatTime';
import Accordion from './Accordion';

const DifferenceItem = ({ difference }) => {
	return (
		<Accordion title={`${difference.TrainLine} [${difference.TrainNumber}] from ${difference.PreviousStop} at ${formatTime(difference.PlannedArrivalTime)}`} itemCount={difference.TrainLineStops.length + ' stops'}>
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

			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{difference.TrainLineStops.map((stop, index) => (
						<tr key={index}>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stop.StopName}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stop.ArrTime ? formatTime(stop.ArrTime) : 'N/A'}</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stop.DepTime ? formatTime(stop.DepTime) : 'N/A'}</td>
						</tr>
					))}
				</tbody>
			</table>

		</Accordion>
	);
};

export default DifferenceItem;