export const getTrainLineCounts = (differences) => {
    const counts = {};
    differences.forEach(diff => {
        const line = diff.TrainLine || 'Unknown';
        counts[line] = (counts[line] || 0) + 1;
    });
    return counts;
};

export const getTotalTrainLineCounts = (differencesPerDay) => {
    const totalCounts = {};
    differencesPerDay.forEach(day => {
        const dayCounts = getTrainLineCounts(day.Differences);
        for (const [line, count] of Object.entries(dayCounts)) {
            totalCounts[line] = (totalCounts[line] || 0) + count;
        }
    });
    return totalCounts;
};

export const getTotalDifferencesCount = (differencesPerDay) => {
    return differencesPerDay.reduce((total, day) => total + day.Differences.length, 0);
};