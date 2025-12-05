import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../src/hooks/useUser';
import Skeleton from './ui/Skeleton';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { data: user, isLoading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                navigate('/');
            } else if (!user.is_admin) { // Note: is_admin needs to be added to User type in frontend
                navigate('/');
            }
        }
    }, [user, isLoading, navigate]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-12 w-1/4 mb-8" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!user || !user.is_admin) {
        return null;
    }

    return <>{children}</>;
};

export default AdminRoute;
