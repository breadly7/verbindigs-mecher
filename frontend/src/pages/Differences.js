import { useEffect, useState } from 'react';

import PageTemplate from '../components/PageTemplate';
import { getScheduleDifferences } from '../services/apiService';
import Accordion from '../components/Accordion';
import DifferenceItem from '../components/DifferenceItem';

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
            {data && data.map(location => (
                <Accordion key={location.name} title={location.name}>
                    {location.differences.map(diff => (
                        <div key={diff.id}>
                            <DifferenceItem difference={diff} />
                        </div>
                    ))}
                </Accordion>
            ))}
        </PageTemplate>
    );
}

export default Differences;