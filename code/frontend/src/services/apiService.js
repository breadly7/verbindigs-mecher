const API_URL = process.env.REACT_APP_API_URL;

export const fetchData = async (endpoint) => {
	try {
		const response = await fetch(`${API_URL}${endpoint}`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const getScheduleDifferences = async () => {
    return fetchData('/schedule/diffs');
};

export const getStatus = async () => {
	return fetchData('/status');
}
