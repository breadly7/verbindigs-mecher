import React from 'react';

import formatTime from '../utils/formatTime';
import Accordion from './Accordion';

const DifferenceItem = ({ difference, currentStop }) => {
	return (
		<Accordion title={`${difference.TrainLine} [${difference.TrainNumber}] from ${difference.PreviousStop} at ${formatTime(difference.PlannedArrivalTime)}`} rightText={`Agency: ${difference.Agency}`}>
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop</th>
						<th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
						<th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{difference.TrainLineStops.map((stop, index) => (
						<tr key={index} style={{ borderBottom: stop.StopName === currentStop ? '1px solid darkgrey' : undefined }}>
							<td className="px-2 py-1 whitespace-nowrap text-xs font-medium text-gray-900" style={{ fontWeight: stop.StopName === currentStop ? 'bold' : 'normal' }}>{stop.StopName}</td>
							<td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">{stop.ArrTime ? formatTime(stop.ArrTime) : 'N/A'}</td>
							<td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">{stop.DepTime ? formatTime(stop.DepTime) : 'N/A'}</td>
						</tr>
					))}
				</tbody>
			</table>
		</Accordion>
	);
};

export default DifferenceItem;