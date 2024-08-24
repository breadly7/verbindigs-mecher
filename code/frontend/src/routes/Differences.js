import { useEffect, useState } from 'react';
import PageTemplate from '../components/PageTemplate';
import { getScheduleDifferences } from '../services/apiService';
import Accordion from '../components/Accordion';
import DifferenceItem from '../components/DifferenceItem';

const Differences = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const result = await getScheduleDifferences();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

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

    return (
        <PageTemplate title="Differences (broken connections)">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                data && data.map(location => {
                    const totalTrainLineCounts = Object.entries(getTotalTrainLineCounts(location.DifferencesPerDay)).sort((a, b) => b[1] - a[1]);
                    return (
                        <Accordion key={location.Name} title={location.Name} itemCount={getTotalDifferencesCount(location.DifferencesPerDay)}>
                            <div className="flex flex-wrap mb-4">
                                {totalTrainLineCounts.map(([line, count]) => (
                                    <span key={line} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                        {line}: {count}
                                    </span>
                                ))}
                            </div>
                            {location.DifferencesPerDay.map(diffPerDay => {
                                const trainLineCounts = Object.entries(getTrainLineCounts(diffPerDay.Differences)).sort((a, b) => b[1] - a[1]);
                                return (
                                    <Accordion key={diffPerDay.Date} title={new Date(diffPerDay.Date).toLocaleDateString()} itemCount={diffPerDay.Differences.length}>
                                        <div className="flex flex-wrap mb-4">
                                            {trainLineCounts.map(([line, count]) => (
                                                <span key={line} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                                    {line}: {count}
                                                </span>
                                            ))}
                                        </div>
                                        {diffPerDay.Differences.map(diff => (
                                            <DifferenceItem key={diff.TrainNumber} difference={diff} />
                                        ))}
                                    </Accordion>
                                );
                            })}
                        </Accordion>
                    );
                })
            )}
        </PageTemplate>
    );
};

export default Differences;