import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: () => void;
}

const SuccessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ErrorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


const icons = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  info: <InfoIcon />,
};

const colors = {
  success: 'bg-green-500/10 border-green-500/30 text-green-300',
  error: 'bg-red-500/10 border-red-500/30 text-red-300',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
};

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300); // Wait for fade out to finish before removing
    }, 4500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <SuccessIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'info':
      default:
        return <InfoIcon />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/90 border-green-500/50 text-green-100 shadow-green-900/20';
      case 'error':
        return 'bg-red-900/90 border-red-500/50 text-red-100 shadow-red-900/20';
      case 'info':
      default:
        return 'bg-blue-900/90 border-blue-500/50 text-blue-100 shadow-blue-900/20';
    }
  };

  return (
    <div
      role="alert"
      className={`
        flex items-start p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 ease-out transform w-full
        ${getStyles()}
        ${isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'}
    `}>
      <div className="flex-shrink-0 mr-3 mt-0.5 animate-pulse-slow">
        {getIcon()}
      </div>
      <p className="flex-grow text-sm font-medium leading-relaxed">{message}</p>
      <button
        onClick={handleDismiss}
        className="ml-4 flex-shrink-0 text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
        aria-label="Close notification"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default React.memo(Toast);