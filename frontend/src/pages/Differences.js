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

    return (
        <PageTemplate title="Differences">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                data && data.map(location => (
                    <Accordion key={location.name} title={location.name}>
                        {location.differences.map(diff => (
                            <DifferenceItem key={diff.train_nr} difference={diff} />
                        ))}
                    </Accordion>
                ))
            )}
        </PageTemplate>
    );
};

export default Differences;