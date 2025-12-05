import React, { useState, useCallback, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import SubscriptionModal from './components/SubscriptionModal';
import AuthModal, { AuthTab } from './components/AuthModal';
import Skeleton from './components/ui/Skeleton';
import ProtectedRoute from './components/ProtectedRoute';
import ProRoute from './components/ProRoute';
import { useToast } from './contexts/ToastContext';
import { logoutUser } from './services/authService';

import { useUser, useInvalidateUser, useSetUser } from './src/hooks/useUser';

const LearningJourney = lazy(() => import('./components/LearningJourney'));
const PromptGenerator = lazy(() => import('./components/PromptGenerator'));
const AccountSettings = lazy(() => import('./components/AccountSettings'));
const CommunityHub = lazy(() => import('./components/CommunityHub'));
const VideoStudio = lazy(() => import('./components/VideoStudio'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
import AdminRoute from './components/AdminRoute';
import ResetPassword from './components/ResetPassword';
import DebugPanel from './components/DebugPanel';

const JourneySkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-8">
    <aside className="lg:w-1/4 xl:w-1/5">
      <Skeleton className="h-8 w-3/4 mb-4" />
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    </aside>
    <section className="lg:w-3/4 xl:w-4/5">
      <Skeleton className="h-[600px] w-full" />
    </section>
  </div>
);

const GeneratorSkeleton = () => (
  <div className="w-full max-w-4xl mx-auto">
    <Skeleton className="h-12 w-3/4 mx-auto mb-2" />
    <Skeleton className="h-6 w-full max-w-lg mx-auto mb-6" />
    <Skeleton className="h-32 w-full mb-6" />
    <Skeleton className="h-12 w-full" />
  </div>
);

const SettingsSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <div>
      <Skeleton className="h-12 w-1/2" />
      <Skeleton className="h-5 w-1/3 mt-2" />
    </div>
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-48 w-full" />
  </div>
);

const CommunitySkeleton = () => (
  <div className="w-full max-w-6xl mx-auto">
    <Skeleton className="h-12 w-1/3 mx-auto mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  </div>
);

const StudioSkeleton = () => (
  <div className="w-full max-w-5xl mx-auto">
    <Skeleton className="h-12 w-1/2 mx-auto mb-8" />
    <Skeleton className="h-[500px] w-full" />
  </div>
);



const App: React.FC = () => {
  const { addToast } = useToast();

  // Subscription state
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionModalReason, setSubscriptionModalReason] = useState<'upgrade' | 'limit_reached'>('upgrade');
  // Auth State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialAuthTab, setInitialAuthTab] = useState<AuthTab>('login');

  const { data: user } = useUser();
  const invalidateUser = useInvalidateUser();
  const setUser = useSetUser();

  // Derived state from user query
  const isAuthenticated = !!user;
  const userId = user?.id || null;
  const userEmail = user?.email || null;
  const hasAccess = user?.subscription_status === 'pro';

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API call failed, clearing state anyway.", error);
    } finally {
      setUser(null);
      addToast("You have been logged out.", "info");
      // Navigation to home will be handled by router if on protected page, or remain if public
    }
  }, [setUser, addToast]);

  // Effect to handle redirect from Stripe checkout
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment') === 'success') {
      addToast('Welcome to Pro! Your subscription has been activated.', 'success');
      invalidateUser(); // Refresh user status to get updated subscription
      window.history.replaceState(null, '', window.location.pathname);
    }
    if (query.get('payment') === 'cancelled') {
      addToast('Your payment was cancelled. You can try again anytime from the upgrade button.', 'info');
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [addToast, invalidateUser]);

  const openSubscriptionModal = useCallback((reason: 'upgrade' | 'limit_reached' = 'upgrade') => {
    setSubscriptionModalReason(reason);
    setShowSubscriptionModal(true);
  }, []);

  const closeSubscriptionModal = () => setShowSubscriptionModal(false);

  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    invalidateUser();
  }, [invalidateUser]);

  const openAuthModal = useCallback((tab: AuthTab = 'login') => {
    setInitialAuthTab(tab);
    setShowAuthModal(true);
  }, []);

  const closeAuthModal = () => setShowAuthModal(false);

  const handleUpgradeClick = useCallback(() => {
    if (isAuthenticated) {
      openSubscriptionModal('upgrade');
    } else {
      openAuthModal('signup');
    }
  }, [isAuthenticated, openSubscriptionModal, openAuthModal]);

  return (
    <BrowserRouter>
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={closeSubscriptionModal}
        reason={subscriptionModalReason}
        onSubscribe={() => { }}
        onPurchase={() => { }}
      />
      <AuthModal
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        onAuthSuccess={handleAuthSuccess}
        initialTab={initialAuthTab}
      />
      <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
        <Header
          isAuthenticated={isAuthenticated}
          hasAccess={hasAccess}
          onAuthClick={openAuthModal}
          onLogout={handleLogout}
          onUpgradeClick={handleUpgradeClick}
          userEmail={userEmail}
        />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="page-fade-in">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/journey"
                element={
                  <Suspense fallback={<JourneySkeleton />}>
                    <LearningJourney />
                  </Suspense>
                }
              />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/generator"
                element={
                  <Suspense fallback={<GeneratorSkeleton />}>
                    <PromptGenerator
                      hasAccess={hasAccess}
                      openSubscriptionModal={openSubscriptionModal}
                      userId={userId}
                      userEmail={userEmail}
                      isAuthenticated={isAuthenticated}
                      openAuthModal={openAuthModal}
                    />
                  </Suspense>
                }
              />
              <Route
                path="/studio"
                element={
                  <ProRoute openSubscriptionModal={openSubscriptionModal}>
                    <Suspense fallback={<StudioSkeleton />}>
                      <VideoStudio />
                    </Suspense>
                  </ProRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProRoute openSubscriptionModal={openSubscriptionModal}>
                    <Suspense fallback={<CommunitySkeleton />}>
                      <CommunityHub
                        hasAccess={hasAccess}
                        openSubscriptionModal={() => openSubscriptionModal('upgrade')}
                      />
                    </Suspense>
                  </ProRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<SettingsSkeleton />}>
                      <AccountSettings
                        userId={userId}
                        userEmail={userEmail}
                        hasAccess={hasAccess}
                        openSubscriptionModal={() => openSubscriptionModal('upgrade')}
                      />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Suspense fallback={<div className="text-center p-8">Loading Admin...</div>}>
                      <AdminDashboard />
                    </Suspense>
                  </AdminRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
        <footer className="text-center py-4 text-gray-500 text-sm">
          <p>&copy; 2025 VEO3 Mastery Hub. All rights reserved.</p>
        </footer>
      </div>
      <DebugPanel />
    </BrowserRouter>
  );
};

export default App;