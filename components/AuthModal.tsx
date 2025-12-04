import React, { useState, useEffect, useRef } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import { loginUser, registerUser } from '../services/authService';

export type AuthTab = 'login' | 'signup';
type AuthView = AuthTab | 'forgotPassword';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
  initialTab?: AuthTab;
}


const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess, initialTab = 'login' }) => {
  const [activeView, setActiveView] = useState<AuthView>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use ref to store latest callbacks to avoid recreating Google initialization
  const onAuthSuccessRef = useRef(onAuthSuccess);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onAuthSuccessRef.current = onAuthSuccess;
    onCloseRef.current = onClose;
  }, [onAuthSuccess, onClose]);

  useEffect(() => {
    if (isOpen) {
      setActiveView(initialTab);
      // Reset form state when modal opens
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError(null);
      setIsLoading(false);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get values directly from form to handle browser autofill
    const form = e.target as HTMLFormElement;
    const emailInput = form.querySelector('#signup-email') as HTMLInputElement;
    const passwordInput = form.querySelector('#signup-password') as HTMLInputElement;
    const confirmPasswordInput = form.querySelector('#signup-confirm-password') as HTMLInputElement;
    const emailValue = emailInput?.value || email;
    const passwordValue = passwordInput?.value || password;
    const confirmPasswordValue = confirmPasswordInput?.value || confirmPassword;

    if (passwordValue !== confirmPasswordValue) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const result = await registerUser(emailValue, passwordValue);
      if (result.ok) {
        // Automatically log the user in after successful registration
        const loginResult = await loginUser(emailValue, passwordValue);
        if (loginResult.ok) {
          onAuthSuccess();
        } else {
          setError(loginResult.message || 'Registration succeeded, but login failed.');
        }
      } else {
        setError(result.message || 'An unknown error occurred during registration.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Get values directly from form to handle browser autofill
    const form = e.target as HTMLFormElement;
    const emailInput = form.querySelector('#login-email') as HTMLInputElement;
    const passwordInput = form.querySelector('#login-password') as HTMLInputElement;
    const emailValue = emailInput?.value || email;
    const passwordValue = passwordInput?.value || password;

    try {
      const result = await loginUser(emailValue, passwordValue);
      if (result.ok) {
        onAuthSuccess();
        onClose();
      } else {
        setError(result.message || 'An unknown error occurred.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('If an account with that email exists, a password reset link has been sent.');
    setActiveView('login');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'forgotPassword':
        return (
          <div>
            <h3 className="font-heading text-2xl text-center text-white mb-2">Reset Password</h3>
            <p className="text-center text-gray-400 text-sm mb-6">Enter your email and we&apos;ll send you a link to get back into your account.</p>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <Input id="reset-email" label="Email" type="email" placeholder="you@example.com" required />
              <Button type="submit" size="lg" className="w-full mt-2">
                Send Reset Link
              </Button>
            </form>
            <div className="text-center mt-4">
              <button onClick={() => setActiveView('login')} className="text-sm text-blue-400 hover:text-blue-300">
                &larr; Back to Login
              </button>
            </div>
          </div>
        );
      case 'login':
      case 'signup':
      default: {
        const isLogin = activeView === 'login';
        return (
          <div className="space-y-4">

            <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
              <Input id={isLogin ? "login-email" : "signup-email"} label="Email" type="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
              <div>
                <Input id={isLogin ? "login-password" : "signup-password"} label="Password" type="password" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
                {isLogin && (
                  <div className="text-right mt-2">
                    <button
                      type="button"
                      onClick={() => setActiveView('forgotPassword')}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>
              {!isLogin && (
                <Input id="signup-confirm-password" label="Confirm Password" type="password" placeholder="••••••••" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              )}

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded-md">{error}</p>
              )}

              <Button type="submit" size="lg" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
              </Button>
            </form>
          </div>
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all" onClick={(e) => e.stopPropagation()}>
        {activeView !== 'forgotPassword' && (
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveView('login')}
              className={`flex-1 py-2 text-lg font-heading tracking-wide transition-colors ${activeView === 'login' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveView('signup')}
              className={`flex-1 py-2 text-lg font-heading tracking-wide transition-colors ${activeView === 'signup' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            >
              Sign Up
            </button>
          </div>
        )}

        {renderContent()}

        {activeView !== 'forgotPassword' && (
          <div className="mt-6 text-center">
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-sm">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;