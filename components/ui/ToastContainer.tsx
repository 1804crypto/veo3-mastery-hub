import React from 'react';
import { ToastMessage } from '../../contexts/ToastContext';
import Toast from './Toast';

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[100] w-full max-w-sm space-y-3">
      {toasts.map(toast => (
        <Toast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type} 
            onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
