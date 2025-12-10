import React, { useState, useEffect, useRef } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import { useGoogleLogin } from '@react-oauth/google';
import { loginUser, registerUser, loginWithGoogle } from '../services/authService';

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

  // Use the implicit flow - gets an access_token instead of id_token
  // This approach avoids the iframe issues with the GoogleLogin component
  const handleGoogleLogin = async (accessToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch user info from Google using the access token
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!userInfoResponse.ok) {
        throw new Error('Failed to get user info from Google');
      }

      const userInfo = await userInfoResponse.json();

      // Send the user info to our backend for authentication
      const result = await loginWithGoogle(accessToken, userInfo);
      if (result.ok) {
        onAuthSuccessRef.current();
        onCloseRef.current();
      } else {
        setError(result.message || 'Google authentication failed.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Connection error: ${errorMessage}`);
      console.error('[AuthModal] Google Auth Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
          onClose();
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (passwordValue.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

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

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const emailInput = form.querySelector('#reset-email') as HTMLInputElement;
    const emailValue = emailInput?.value;

    if (!emailValue) return;

    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setActiveView('login');
      } else {
        setError(data.message || 'Failed to send reset link.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
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

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const googleLogin = useGoogleLogin({
          onSuccess: (tokenResponse) => {
            handleGoogleLogin(tokenResponse.access_token);
          },
          onError: () => {
            setError('Google Sign-In failed. Please try again.');
          },
          flow: 'implicit',
        });

        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <button
                type="button"
                onClick={() => googleLogin()}
                disabled={isLoading}
                className="flex items-center justify-center gap-3 w-full max-w-[320px] px-6 py-3 bg-white text-gray-700 font-medium rounded-full border border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-4">
              <div className="border-t border-gray-600 w-full"></div>
              <span className="bg-gray-800 px-3 text-gray-400 text-sm">OR</span>
              <div className="border-t border-gray-600 w-full"></div>
            </div>

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
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (isLogin ? 'Login' : 'Create Account')}
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