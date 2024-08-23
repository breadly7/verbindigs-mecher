import React, { useEffect, useState } from 'react';

import PageTemplate from './PageTemplate';
import { getScheduleDifferences } from '../services/apiService';

const Differences = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const result = await getScheduleDifferences();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getData();
    }, []);

    return (
        <PageTemplate title="Differences">
            <p>This is where your content goes.</p>
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </PageTemplate>
    );
}

export default Differences;