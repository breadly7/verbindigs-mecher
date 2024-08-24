import React, { useEffect, useState } from 'react';
import PageTemplate from '../components/PageTemplate';
import { getStatus } from '../services/apiService';
import packageJson from '../../package.json';

const Home = () => {
    const [backendVersion, setBackendVersion] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBackendStatus= async () => {
            try {
                const status = await getStatus();
                setBackendVersion(status.version);
            } catch (error) {
                console.error('Error fetching backend version:', error);
                setError('Error fetching backend version');
            }
        };

        fetchBackendStatus();
    }, []);

    return (
        <PageTemplate title="Home">
            <h2>Welcome to Verbindigs Mecher</h2>
            <p>Frontend Version: {packageJson.version}</p>
            {error ? (
                <p className="text-red-600">{error}</p>
            ) : (
                <p>Backend Version: {backendVersion}</p>
            )}
        </PageTemplate>
    );
};

export default Home;