import React, { useState, useCallback, lazy, Suspense, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import SubscriptionModal from './components/SubscriptionModal';
import AuthModal, { AuthTab } from './components/AuthModal';
import Skeleton from './components/ui/Skeleton';
import { Page } from './src/types';
import { useToast } from './contexts/ToastContext';
import { logoutUser } from './services/authService';

import { useUser, useInvalidateUser, useSetUser } from './src/hooks/useUser';

const LearningJourney = lazy(() => import('./components/LearningJourney'));
const PromptGenerator = lazy(() => import('./components/PromptGenerator'));
const AccountSettings = lazy(() => import('./components/AccountSettings'));
const CommunityHub = lazy(() => import('./components/CommunityHub'));
const VideoStudio = lazy(() => import('./components/VideoStudio'));

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
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { addToast } = useToast();

  // Subscription state
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionModalReason, setSubscriptionModalReason] = useState<'upgrade' | 'limit_reached'>('upgrade');
  // Auth State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialAuthTab, setInitialAuthTab] = useState<AuthTab>('login');

  // State for passing prompt to Video Studio
  const [promptForStudio, setPromptForStudio] = useState<string | null>(null);

  const { data: user, isLoading: isUserLoading } = useUser();
  const invalidateUser = useInvalidateUser();
  const setUser = useSetUser();

  // Derived state from user query
  const isAuthenticated = !!user;
  const userId = user?.id || null;
  const userEmail = user?.email || null;
  const hasAccess = user?.subscription_status === 'pro';

  // Redirect logic for protected routes
  useEffect(() => {
    if (!isUserLoading && !isAuthenticated) {
      const publicPages: Page[] = ['home', 'journey'];
      if (!publicPages.includes(currentPage)) {
        setCurrentPage('home');
        setShowAuthModal(true);
        setInitialAuthTab('login');
      }
    }
  }, [isAuthenticated, isUserLoading, currentPage]);

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API call failed, clearing state anyway.", error);
    } finally {
      setUser(null);
      addToast("You have been logged out.", "info");
      setCurrentPage('home');
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



  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const openSubscriptionModal = useCallback((reason: 'upgrade' | 'limit_reached' = 'upgrade') => {
    setSubscriptionModalReason(reason);
    setShowSubscriptionModal(true);
  }, []);

  const closeSubscriptionModal = () => setShowSubscriptionModal(false);

  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    invalidateUser();
  }, [invalidateUser]);

  // Google Sign-In is now handled in AuthModal component
  const handleGoogleSignIn = useCallback(() => {
    // This is handled by AuthModal component
    // The modal will trigger Google Sign-In when the button is clicked
  }, []);

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

  const handleNavigateToStudio = (prompt: string) => {
    setPromptForStudio(prompt);
    navigate('studio');
  };

  const renderContent = () => {
    let content;
    let fallback;

    switch (currentPage) {
      case 'journey':
        content = <LearningJourney />;
        fallback = <JourneySkeleton />;
        break;
      case 'generator':
        content = <PromptGenerator hasAccess={hasAccess} openSubscriptionModal={openSubscriptionModal} userId={userId} userEmail={userEmail} isAuthenticated={isAuthenticated} navigateToStudio={handleNavigateToStudio} openAuthModal={openAuthModal} />;
        fallback = <GeneratorSkeleton />;
        break;
      case 'settings':
        content = <AccountSettings userId={userId} userEmail={userEmail} hasAccess={hasAccess} openSubscriptionModal={() => openSubscriptionModal('upgrade')} />;
        fallback = <SettingsSkeleton />;
        break;
      case 'community':
        content = <CommunityHub hasAccess={hasAccess} openSubscriptionModal={() => openSubscriptionModal('upgrade')} />;
        fallback = <CommunitySkeleton />;
        break;
      case 'studio':
        content = <VideoStudio initialPrompt={promptForStudio} />;
        fallback = <StudioSkeleton />;
        break;
      case 'home':
      default:
        content = <Home navigate={navigate} />;
        fallback = null; // Home is not lazy loaded
    }
    return (
      <div key={currentPage} className="page-fade-in">
        <Suspense fallback={fallback}>
          {content}
        </Suspense>
      </div>
    );
  };

  return (
    <>
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={closeSubscriptionModal}
        reason={subscriptionModalReason}
        // These are placeholders, they will be implemented later
        onSubscribe={() => { }}
        onPurchase={() => { }}
      />
      <AuthModal
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        onAuthSuccess={handleAuthSuccess}
        onGoogleSignIn={handleGoogleSignIn}
        initialTab={initialAuthTab}
      />
      <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
        <Header
          currentPage={currentPage}
          navigate={navigate}
          isAuthenticated={isAuthenticated}
          hasAccess={hasAccess}
          onAuthClick={openAuthModal}
          onLogout={handleLogout}
          onUpgradeClick={handleUpgradeClick}
          userEmail={userEmail}
        />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          {renderContent()}
        </main>
        <footer className="text-center py-4 text-gray-500 text-sm">
          <p>&copy; 2025 VEO3 Mastery Hub. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default App;