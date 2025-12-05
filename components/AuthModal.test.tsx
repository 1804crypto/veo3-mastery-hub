import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AuthModal from './AuthModal';
import * as authService from '../services/authService';

// Mock the auth service
vi.mock('../services/authService', () => ({
    loginUser: vi.fn(),
    registerUser: vi.fn(),
    loginWithGoogle: vi.fn(),
}));

// Mock GoogleLogin component
// Mock GoogleLogin component
vi.mock('@react-oauth/google', () => ({
    GoogleLogin: ({ onSuccess }: { onSuccess: (response: any) => void }) => (
        <button onClick={() => onSuccess({ credential: 'mock-token' })}>
            Sign in with Google
        </button>
    ),
}));

describe('AuthModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders nothing when isOpen is false', () => {
        render(
            <AuthModal
                isOpen={false}
                onClose={mockOnClose}
                onAuthSuccess={mockOnSuccess}
            />
        );
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });

    it('renders login form by default', () => {
        render(
            <AuthModal
                isOpen={true}
                onClose={mockOnClose}
                onAuthSuccess={mockOnSuccess}
            />
        );
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        const loginButtons = screen.getAllByRole('button', { name: 'Login' });
        expect(loginButtons).toHaveLength(2); // Tab and Submit button
        expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    });

    it('switches to signup form', () => {
        render(
            <AuthModal
                isOpen={true}
                onClose={mockOnClose}
                onAuthSuccess={mockOnSuccess}
            />
        );

        fireEvent.click(screen.getByText('Sign Up'));

        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });

    it('handles successful login', async () => {
        (authService.loginUser as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });

        render(
            <AuthModal
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess} // Changed prop name
            />
        );

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        const loginButtons = screen.getAllByRole('button', { name: 'Login' });
        const submitButton = loginButtons.find(button => button.getAttribute('type') === 'submit');
        fireEvent.click(submitButton!);

        await waitFor(() => {
            expect(authService.loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockOnSuccess).toHaveBeenCalled(); // Changed mock name
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('handles successful registration', async () => {
        (authService.registerUser as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });

        render(
            <AuthModal
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        // Switch to sign up
        fireEvent.click(screen.getByText(/create an account/i));

        // Fill out form
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' }
        });
        fireEvent.change(screen.getByLabelText(/confirm password/i), {
            target: { value: 'password123' }
        });

        // Submit
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(authService.registerUser).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('handles login error', async () => {
        (authService.loginUser as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false, message: 'Invalid credentials' });

        render(
            <AuthModal
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess} // Changed prop name
            />
        );

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
        const loginButtons = screen.getAllByRole('button', { name: 'Login' });
        const submitButton = loginButtons.find(button => button.getAttribute('type') === 'submit');
        fireEvent.click(submitButton!);

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
            expect(mockOnSuccess).not.toHaveBeenCalled(); // Changed mock name
        });
    });

    it('handles registration error correctly', async () => {
        (authService.registerUser as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false, message: 'Email already in use' });

        render(
            <AuthModal
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        // Switch to sign up
        fireEvent.click(screen.getByText(/create an account/i));

        // Fill out form
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'existing@example.com' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' }
        });
        fireEvent.change(screen.getByLabelText(/confirm password/i), {
            target: { value: 'password123' }
        });

        // Submit
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText(/email already in use/i)).toBeInTheDocument();
            expect(mockOnSuccess).not.toHaveBeenCalled();
        });
    });

    it('handles Google login success', async () => {
        (authService.loginWithGoogle as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });

        render(
            <AuthModal
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess} // Changed prop name
            />
        );

        fireEvent.click(screen.getByText('Sign in with Google'));

        await waitFor(() => {
            expect(authService.loginWithGoogle).toHaveBeenCalledWith('mock-token');
            expect(mockOnSuccess).toHaveBeenCalled(); // Changed mock name
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('handles Google login error', async () => {
        (authService.loginWithGoogle as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false, message: 'Google login failed' });

        render(
            <AuthModal
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        fireEvent.click(screen.getByText('Sign in with Google'));

        await waitFor(() => {
            expect(screen.getByText('Google login failed')).toBeInTheDocument();
            expect(mockOnSuccess).not.toHaveBeenCalled();
        });
    });

    it('validates email format', async () => {
        render(
            <AuthModal
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        const loginButtons = screen.getAllByRole('button', { name: 'Login' });
        const submitButton = loginButtons.find(button => button.getAttribute('type') === 'submit');
        fireEvent.click(submitButton!);

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
            expect(authService.loginUser).not.toHaveBeenCalled();
        });
    });

    it('validates password length for login', async () => {
        render(
            <AuthModal
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'short' } });
        const loginButtons = screen.getAllByRole('button', { name: 'Login' });
        const submitButton = loginButtons.find(button => button.getAttribute('type') === 'submit');
        fireEvent.click(submitButton!);

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 6 characters long.')).toBeInTheDocument();
            expect(authService.loginUser).not.toHaveBeenCalled();
        });
    });

    it('validates password match for registration', async () => {
        render(
            <AuthModal
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        fireEvent.click(screen.getByText('Sign Up'));

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'different' } });
        fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

        await waitFor(() => {
            expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
            expect(authService.registerUser).not.toHaveBeenCalled();
        });
    });
});
