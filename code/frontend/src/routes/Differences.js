import { useState } from 'react';
import AsyncSelect from 'react-select/async';

import PageTemplate from '../components/PageTemplate';
import { getSearchStop } from '../services/apiService';
import Accordion from '../components/Accordion';
import DifferenceItem from '../components/DifferenceItem';
import useScheduleDifferences from '../hooks/useScheduleDifferences';
import LoadingSpinner from '../components/LoadingSpinner';

const Differences = () => {
    const [selectedStops, setSelectedStops] = useState([]);
    const { data, loading, error } = useScheduleDifferences(selectedStops);

    const getTrainLineCounts = (differences) => {
        const counts = {};
        differences.forEach(diff => {
            const line = diff.TrainLine || 'Unknown';
            counts[line] = (counts[line] || 0) + 1;
        });
        return counts;
    };

    const getTotalTrainLineCounts = (differencesPerDay) => {
        const totalCounts = {};
        differencesPerDay.forEach(day => {
            const dayCounts = getTrainLineCounts(day.Differences);
            for (const [line, count] of Object.entries(dayCounts)) {
                totalCounts[line] = (totalCounts[line] || 0) + count;
            }
        });
        return totalCounts;
    };

    const getTotalDifferencesCount = (differencesPerDay) => {
        return differencesPerDay.reduce((total, day) => total + day.Differences.length, 0);
    };

    const loadStops = async inputValue => {
        const results = await getSearchStop(inputValue);

        return results.map(result => ({
            value: result.Id,
            label: result.Name
        }));
    };

    return (
        <PageTemplate title="Differences (broken connections)">
            <AsyncSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadStops}
                onChange={setSelectedStops}
                className="mb-2"
            />
            {loading && <LoadingSpinner />}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && data && data.map(location => {
                const totalTrainLineCounts = Object.entries(getTotalTrainLineCounts(location.DifferencesPerDay)).sort((a, b) => b[1] - a[1]);
                return (
                    <Accordion key={location.Name} title={location.Name} itemCount={getTotalDifferencesCount(location.DifferencesPerDay)}>
                        <div className="flex flex-wrap mb-4">
                            {totalTrainLineCounts.map(([line, count]) => (
                                <span key={line} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 mb-1 px-2.5 py-0.5 rounded">
                                    {line}: {count}
                                </span>
                            ))}
                        </div>
                        {location.DifferencesPerDay.map(diffPerDay => {
                            const trainLineCounts = Object.entries(getTrainLineCounts(diffPerDay.Differences)).sort((a, b) => b[1] - a[1]);
                            const hasNoAlternateConnection = diffPerDay.Differences.some(diff => diff.AlternateTrain === null);
                            return (
                                <Accordion
                                    key={diffPerDay.Date}
                                    title={new Date(diffPerDay.Date).toLocaleDateString()}
                                    itemCount={diffPerDay.Differences.length}
                                    isSpecificDay={true}
                                    color={hasNoAlternateConnection ? 'yellow' : 'blue'}
                                >
                                    <div className="flex flex-wrap mb-4">
                                        {trainLineCounts.map(([line, count]) => (
                                            <span key={line} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 mb-1 px-2.5 py-0.5 rounded">
                                                {line}: {count}
                                            </span>
                                        ))}
                                    </div>
                                    {diffPerDay.Differences.map(diff => (
                                        <DifferenceItem key={diff.TrainNumber} difference={diff} currentStop={location.Name} />
                                    ))}
                                    {hasNoAlternateConnection && (
                                        <div className="mt-4 text-red-500 text-xs">
                                            Warning: At least one connection has no alternate train.
                                        </div>
                                    )}
                                </Accordion>
                            );
                        })}
                    </Accordion>
                );
            })}
            {!loading && (!data || data.length === 0) && (
                <p className="text-gray-500">Please select a stop!</p>
            )}
        </PageTemplate>
    );
};

export default Differences;