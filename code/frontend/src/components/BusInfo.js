import { useEffect, useState } from 'react';

import { getBusInfo } from '../services/apiService';
import LoadingSpinner from './LoadingSpinner';
import formatTime from '../utils/formatTime';

const BusInfo = ({ stationId, regularArrTime, delayedArrTime, day }) => {
    const [busInfo, setBusInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBusInfo = async () => {
            try {
                const data = await getBusInfo(stationId, regularArrTime, delayedArrTime, day);
                setBusInfo(data);
            } catch (err) {
                setError('Error fetching bus information');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBusInfo();
    }, [stationId, regularArrTime, delayedArrTime, day]);

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-xs text-red-500">{error}</p>;

    return (
        <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">Problematic Busses</h3>
            {busInfo.length === 0 ? (
                <p className="text-xs text-gray-500">No problematic busses found.</p>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop Name</th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop Departure</th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Walk Minutes</th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination Stop Name</th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agency</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {busInfo.map((bus, index) => (
                            <tr key={index}>
                                <td className="px-2 py-1 whitespace-nowrap text-xs font-medium text-gray-900">{bus.StopName}</td>
                                <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">{formatTime(bus.StopDeparture)}</td>
                                <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">{bus.WalkMinutes}</td>
                                <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">{bus.DestinationStopName}</td>
                                <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-500">{bus.Agency}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BusInfo;