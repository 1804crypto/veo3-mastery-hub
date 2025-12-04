import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { useToast } from '../contexts/ToastContext';

interface ProRouteProps {
    children: React.ReactNode;
    openSubscriptionModal: (reason: 'upgrade' | 'limit_reached') => void;
}

const ProRoute: React.FC<ProRouteProps> = ({ children, openSubscriptionModal }) => {
    const { user, isAuthenticated } = useAppStore();
    const location = useLocation();
    const { addToast } = useToast();

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location, openAuth: true }} replace />;
    }

    const isPro = user?.subscription === 'pro' || user?.subscription === 'lifetime';

    if (!isPro) {
        // Redirect to home but trigger the subscription modal
        // We can't easily trigger the modal *and* render the home page from here without state
        // So we'll render a placeholder that triggers the modal then redirects
        return <ProRedirect openSubscriptionModal={openSubscriptionModal} />;
    }

    return <>{children}</>;
};

const ProRedirect: React.FC<{ openSubscriptionModal: (reason: 'upgrade') => void }> = ({ openSubscriptionModal }) => {
    const { addToast } = useToast();

    React.useEffect(() => {
        addToast('This feature is available for Pro users only.', 'info');
        openSubscriptionModal('upgrade');
    }, [addToast, openSubscriptionModal]);

    return <Navigate to="/" replace />;
};

export default ProRoute;
