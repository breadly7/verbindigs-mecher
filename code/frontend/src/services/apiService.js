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

export const getScheduleDifferences = async stopIds => {
    return fetchData('/schedule/diffs', { stationIds: stopIds.join(',') });
};

export const getSearchStop = async term => {
	return fetchData('/schedule/stops', { searchTerm: term });
}

export const getStatus = async () => {
	return fetchData('/status');
};
