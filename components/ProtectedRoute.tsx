import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../src/hooks/useUser';
import Skeleton from './ui/Skeleton';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { data: user, isLoading } = useUser();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-[600px] w-full" />
            </div>
        );
    }

    if (!user) {
        // Redirect to home, but pass the current location state so we could potentially 
        // open the login modal or redirect back after login (if we implemented that flow)
        return <Navigate to="/" state={{ from: location, openAuth: true }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
