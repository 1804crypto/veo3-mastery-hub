import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import { useToast } from '../contexts/ToastContext';
import { useCreateCheckoutSession } from '../src/hooks/usePayment';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: 'upgrade' | 'limit_reached';
}

// Get Stripe publishable key from environment variable
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Let TypeScript know that the Stripe object is available on the window
declare global {
  interface Window {
    Stripe: (key: string) => {
      redirectToCheckout: (options: { sessionId: string }) => Promise<{ error?: { message: string } }>;
    };
  }
}

// --- Payment Method Icons ---
const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const PaymentIcons = () => (
  <div className="flex justify-center items-center gap-2 h-6">
    {/* Visa */}
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48"><path fill="#1565C0" d="M15.186 19l-2.626 7.86A1 1 0 0 0 13.5 28h2.622l.71-2.122h4.332l.394 1.182H19.25c-.553 0-1 .447-1 1s.447 1 1 1h2.25l-1.579-4.732c2.651-.473 4.249-2.964 3.305-5.268C22.384 15.12 19.342 14 16.5 14c-1.238 0-2.42.34-3.5.953l-1.168-3.504a1 1 0 0 0-1.898.632L15.186 19zM16.5 16c1.43 0 2.5.839 2.941 2.002c.44 1.16-.499 2.373-1.941 2.373h-1.934l.934-2.802c.34-.991 1.01-1.573 1.944-1.573z"></path><path fill="#1565C0" d="M25.132 12.132A1 1 0 0 0 24 13.25v13.5a1 1 0 0 0 1.868.498l3.166-9.497l3.166 9.497A1 1 0 0 0 34 26.75v-13.5a1 1 0 0 0-1.132-1.118a1 1 0 0 0-.868.618L29 18.536l-3-5.786a1 1 0 0 0-1.012-.618z"></path><path fill="#1565C0" d="M37.5 14c-2.481 0-4.5 2.019-4.5 4.5S35.019 23 37.5 23c1.905 0 3.535-1.188 4.194-2.83l-1.82-.607C39.467 20.485 38.54 21 37.5 21c-1.378 0-2.5-1.122-2.5-2.5s1.122-2.5 2.5-2.5c1.04 0 1.967.515 2.374 1.437l1.82-.607C41.035 15.188 39.405 14 37.5 14z"></path></svg>
    {/* Mastercard */}
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48"><path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"></path><path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"></path><path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"></path></svg>
    {/* Apple Pay / Google Pay */}
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6" viewBox="0 0 24 24" fill="white"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-1 14H5c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1z" /><path fill="none" d="M0 0h24v24H0z" /><path d="M6.35 15h.7c.56 0 .99-.44.99-.99v-1.93c0-.55-.44-1-1-1h-1.6c-.55 0-.99.45-.99 1v2.92h1.95zm.99-2.42h.6v.91h-.6v-.91zm5.34-1.58h-1.6c-.55 0-.99.45-.99 1v2.92h.99v-1.16h.6v1.16h.99v-2.92c0-.55-.44-1-.99-1zm0 1.5h-.6v-.51h.6v.51zm4.31-1.5h-.99v2.92h.99v-2.92z" /></svg>
  </div>
);

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, reason }) => {
  const [isProcessing, setIsProcessing] = useState<null | 'monthly' | 'lifetime'>(null);
  const { addToast } = useToast();

  const { mutateAsync: createSession, isPending: isCreatingSession } = useCreateCheckoutSession();

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setTimeout(() => setIsProcessing(null), 300); // delay to allow for closing animation
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayment = async (type: 'monthly' | 'lifetime') => {
    setIsProcessing(type);
    const planId = type === 'monthly' ? 'pro_monthly' : 'lifetime';

    try {
      // 1. Call backend to create a checkout session
      const sessionData = await createSession({ planId });

      // 2. Redirect to Stripe Checkout using the session ID
      if (!STRIPE_PUBLISHABLE_KEY) {
        throw new Error('Stripe publishable key is not configured. Please contact support.');
      }

      const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        throw new Error('Stripe.js has not loaded. Please check your connection.');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionData.sessionId,
      });

      if (error) {
        console.error('Stripe redirection error:', error);
        addToast(`Error: ${error.message}`, 'error');
      }
    } catch (error: unknown) {
      console.error('Payment initiation failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      addToast(errorMessage || 'An unexpected error occurred. Please try again.', 'error');
    } finally {
      // This part is only reached if redirectToCheckout fails.
      // On a successful redirect, the user navigates away from the page.
      setIsProcessing(null);
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    onClose();
  }

  const title = reason === 'limit_reached' ? "Daily Limit Reached" : "Unlock Unlimited Access";
  const description = reason === 'limit_reached'
    ? "You've used your 5 free generations for today. Subscribe to get unlimited access, or wait 24 hours for your credits to recharge."
    : "Subscribe for full, unlimited access to the VEO3 Prompt Generator and create blockbuster-level prompts instantly.";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-2xl w-full transform transition-all" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-heading text-4xl text-center text-blue-400">{title}</h2>
        <p className="mt-4 text-center text-gray-300">{description}</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Plan */}
          <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600 flex flex-col">
            <h3 className="font-heading text-2xl text-white">Pro Plan</h3>
            <p className="text-4xl font-bold text-white mt-2">
              $4 <span className="text-lg font-normal text-gray-400">/ month</span>
            </p>
            <p className="text-sm text-gray-400 mt-1 flex-grow">Billed monthly. Cancel anytime.</p>
            <div className="mt-6">
              <p className="text-center text-xs text-gray-500">Secure checkout powered by Stripe</p>
              <PaymentIcons />
            </div>
            <Button onClick={() => handlePayment('monthly')} size="lg" className="w-full mt-4" disabled={!!isProcessing}>
              {isProcessing === 'monthly' ? <><LoadingSpinner /> Redirecting...</> : 'Subscribe'}
            </Button>
          </div>

          {/* Lifetime Plan */}
          <div className="bg-blue-500/10 rounded-lg p-6 border border-blue-400 flex flex-col ring-2 ring-blue-400">
            <div className="flex justify-between items-center">
              <h3 className="font-heading text-2xl text-blue-300">Lifetime</h3>
              <span className="bg-blue-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">BEST VALUE</span>
            </div>
            <p className="text-4xl font-bold text-white mt-2">
              $49.99
            </p>
            <p className="text-sm text-gray-400 mt-1 flex-grow">One-time payment for lifetime access.</p>
            <div className="mt-6">
              <p className="text-center text-xs text-gray-500">Secure checkout powered by Stripe</p>
              <PaymentIcons />
            </div>
            <Button onClick={() => handlePayment('lifetime')} size="lg" variant="primary" className="w-full mt-4" disabled={!!isProcessing}>
              {isProcessing === 'lifetime' ? <><LoadingSpinner /> Redirecting...</> : 'Purchase Lifetime'}
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;