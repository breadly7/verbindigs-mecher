// code/frontend/src/hooks/useScheduleDifferences.js
import { useState, useEffect } from 'react';
import { getScheduleDifferences } from '../services/apiService';

const useScheduleDifferences = (selectedStops, startDate, endDate) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedStops.length === 0) {
                setLoading(false);
                setData(null);
                return;
            }

            try {
                setLoading(true);
                const stopIds = selectedStops.map(stop => stop.value);
                const result = await getScheduleDifferences(stopIds, startDate, endDate);
                setData(result);
            } catch (error) {
                setError('Error fetching data');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedStops, startDate, endDate]);

    return { data, loading, error };
};

export default useScheduleDifferences;