import { NavLink, Outlet } from 'react-router-dom';

import ErrorBoundary from '../components/ErrorBoundary';

const activeClass = ({ isActive }) => isActive ? "text-white bg-blue-700 h-full flex items-center px-4" : "text-white h-full flex items-center px-4"

const Root = () => (
    <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 px-4">
            <div className="container mx-auto flex justify-between">
                <div className="flex items-center">
                    <h1 className="text-white text-2xl mr-4 p-4">Verbindigs🔧Mecher</h1>
                    <NavLink 
                        to="/" 
                        className={activeClass}
                    >
                        Home
                    </NavLink>
                    <NavLink 
                        to="/differences" 
                        className={activeClass}
                    >
                        Differences
                    </NavLink>
                </div>
            </div>
        </nav>
        <div className="container mx-auto py-4">
            <ErrorBoundary>
                <Outlet />
            </ErrorBoundary>
        </div>
    </div>
);

export default Root;