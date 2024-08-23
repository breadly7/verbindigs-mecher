import React from 'react';

const DifferenceItem = ({ difference }) => {
	return (
		<div className="p-4 bg-white rounded-lg shadow-md mb-4">
			<div className="flex justify-between items-center">
				<div className="flex-1 px-2">
					<strong>Date:</strong> {difference.date}
				</div>
				<div className="flex-1 px-2">
					<strong>Train Number:</strong> {difference.train_nr}
				</div>
				<div className="flex-1 px-2">
					<strong>Planned Arrival Time:</strong> {difference.planned_arrival_time}
				</div>
				<div className="flex-1 px-2">
					<strong>Construction Arrival Time:</strong> {difference.construction_arrival_time}
				</div>
			</div>
		</div>
	);
};

export default DifferenceItem;