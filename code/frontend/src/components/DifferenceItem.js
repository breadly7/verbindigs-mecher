import React from 'react';

import formatTime from '../utils/formatTime';
import Accordion from './Accordion';

const DifferenceItem = ({ difference, currentStop }) => {
	return (
		<Accordion
			title={`${difference.TrainLine} [${difference.TrainNumber}] from ${difference.PreviousStop} at ${formatTime(difference.PlannedArrivalTime)}`}
			rightText={`Agency: ${difference.Agency}`}
			color={difference.AlternateTrain ? 'blue' : 'yellow'}
		>
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop</th>
						<th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
						<th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{difference.TrainLineStops.map((stop, index) => {
						const arrTime = stop.ArrTime ? formatTime(stop.ArrTime) : 'N/A';
						const depTime = stop.DepTime ? formatTime(stop.DepTime) : 'N/A';

						const hasAlternative = difference.AlternateTrain !== null;
						const alternativeStop = hasAlternative ? difference.AlternateTrain.TrainLineStops.filter(s => s.StopName === stop.StopName)[0] : null;

						const altArrTime = alternativeStop ? (alternativeStop.ArrTime ? formatTime(alternativeStop.ArrTime) : 'N/A') : null;
						const altDepTime = alternativeStop ? (alternativeStop.DepTime ? formatTime(alternativeStop.DepTime) : 'N/A') : null;

						const hasAltArrTime = altArrTime ? arrTime !== altArrTime : false;
						const hasAltDepTime = altArrTime ? depTime !== altDepTime : false;

						const rowStyle = {
                            borderBottom: stop.StopName === currentStop ? '1px solid darkgrey' : undefined,
                            textDecoration: hasAlternative && !alternativeStop ? 'line-through' : undefined,
                            color: hasAlternative && !alternativeStop ? 'red' : undefined
                        };

						return (
							<tr key={index} style={rowStyle}>
								<td className="px-2 py-1 whitespace-nowrap text-xs font-medium text-gray-900" style={{ fontWeight: stop.StopName === currentStop ? 'bold' : 'normal' }}>
									{stop.StopName}
								</td>
								<td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">
									{hasAltArrTime ? (
										<>
											<span style={{ textDecoration: 'line-through', color: 'red' }}><span className="text-gray-500">{arrTime}</span></span>
											<span className="ml-2">{altArrTime}</span>
										</>
									) : (
										arrTime
									)}
								</td>
								<td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">
									{hasAltDepTime ? (
										<>
											<span style={{ textDecoration: 'line-through', color: 'red' }}><span className="text-gray-500">{depTime}</span></span>
											<span className="ml-2">{altDepTime}</span>
										</>
									) : (
										depTime
									)}
								</td>
							</tr>
						)
					}
					)}
				</tbody>
			</table>
			{!difference.AlternateTrain && (
                <div className="my-2 text-red-500 text-xs">
                    Warning: No alternate train was found.
                </div>
            )}
		</Accordion>
	);
};

export default DifferenceItem;