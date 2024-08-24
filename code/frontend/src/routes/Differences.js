import { useState } from 'react';
import AsyncSelect from 'react-select/async';

import Accordion from '../components/Accordion';
import DifferenceItem from '../components/DifferenceItem';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTemplate from '../components/PageTemplate';
import TrainLineTags from '../components/TrainLineTags';

import useScheduleDifferences from '../hooks/useScheduleDifferences';

import { getSearchStop } from '../services/apiService';

import { getTrainLineCounts, getTotalTrainLineCounts, getTotalDifferencesCount } from '../utils/differences';

const Differences = () => {
    const [selectedStops, setSelectedStops] = useState([]);
    const { data, loading, error } = useScheduleDifferences(selectedStops);

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
                        <TrainLineTags counts={totalTrainLineCounts} />
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
                                    <TrainLineTags counts={trainLineCounts} />
                                    {hasNoAlternateConnection && (
                                        <div className="mb-2 text-red-500 text-xs">
                                            Warning: At least one connection has no alternate train.
                                        </div>
                                    )}
                                    {diffPerDay.Differences.map(diff => (
                                        <DifferenceItem key={diff.TrainNumber} difference={diff} currentStop={location.Name} />
                                    ))}
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