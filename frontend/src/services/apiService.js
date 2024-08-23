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
            "name": "Bern",
            "differences": [
                {
                    "date": "2021-08-01",
                    "train_nr": "123",
                    "planned_arrival_time": "16:00",
                    "construction_arrival_time": "16:10"
                },
                {
                    "date": "2021-08-01",
                    "train_nr": "124",
                    "planned_arrival_time": "17:00",
                    "construction_arrival_time": "17:10"
                },
            ]
        },
        {
            "name": "Thun",
            "differences": [
                {
                    "date": "2021-08-01",
                    "train_nr": "234",
                    "planned_arrival_time": "16:00",
                    "construction_arrival_time": "16:10"
                },
            ]
        }
    ])
};
