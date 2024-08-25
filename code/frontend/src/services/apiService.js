const API_URL = process.env.REACT_APP_API_URL;

export const fetchData = async (endpoint, queryParams = {}) => {
	try {
		const queryString = new URLSearchParams(queryParams).toString();
        const url = `${API_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

		const response = await fetch(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const getScheduleDifferences = async (stopIds, startDate, endDate) => {
	const query = {
		stationIds: stopIds.join(',')
	}

	if (startDate) {
		query.startDate = startDate;
	}
	if (endDate) {
		query.endDate = endDate;
	}

    return fetchData('/schedule/diffs', query);
};

export const getSearchStop = async term => {
	return fetchData('/schedule/stops', { searchTerm: term });
}

export const getBusInfo = async (stationId, regularArrTime, delayedArrTime, day) => {
    const query = {
        stationId,
        regularArrTime,
        delayedArrTime,
        day
    };

    return fetchData('/schedule/businfo', query);
};

export const getStatus = async () => {
	return fetchData('/status');
};
