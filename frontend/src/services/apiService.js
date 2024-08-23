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
	// return await fetchData('/schedule/diff');
    return Promise.resolve([
        {
            "name": "Thun",
            "differences": [
                {
                    "date": "2021-08-01",
                    "train_nr": "Thun",
                    "planned_arrival_time": "16:00",
                    "construction_arrival_time": "16:10"
                },
            ]
        }
    ])
};
