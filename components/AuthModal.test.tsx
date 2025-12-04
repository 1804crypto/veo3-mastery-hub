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
vi.mock('@react-oauth/google', () => ({
    GoogleLogin: ({ onSuccess, onError }: any) => (
        <button onClick={() => onSuccess({ credential: 'mock-token' })}>
            Sign in with Google
        </button>
    ),
}));

describe('AuthModal', () => {
    const mockOnClose = vi.fn();
    const mockOnAuthSuccess = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders nothing when isOpen is false', () => {
        render(
            <AuthModal
                isOpen={false}
                onClose={mockOnClose}
                onAuthSuccess={mockOnAuthSuccess}
            />
        );
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });

    it('renders login form by default', () => {
        render(
            <AuthModal
                isOpen={true}
                onClose={mockOnClose}
                onAuthSuccess={mockOnAuthSuccess}
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
                onAuthSuccess={mockOnAuthSuccess}
            />
        );

        fireEvent.click(screen.getByText('Sign Up'));

        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });

    it('handles successful login', async () => {
        (authService.loginUser as any).mockResolvedValue({ ok: true });

        render(
            <AuthModal
                isOpen={true}
                onClose={mockOnClose}
                onAuthSuccess={mockOnAuthSuccess}
            />
        );

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        const loginButtons = screen.getAllByRole('button', { name: 'Login' });
        const submitButton = loginButtons.find(button => button.getAttribute('type') === 'submit');
        fireEvent.click(submitButton!);

        await waitFor(() => {
            expect(authService.loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockOnAuthSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('handles login error', async () => {
        (authService.loginUser as any).mockResolvedValue({ ok: false, message: 'Invalid credentials' });

        render(
            <AuthModal
                isOpen={true}
                onClose={mockOnClose}
                onAuthSuccess={mockOnAuthSuccess}
            />
        );

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
        const loginButtons = screen.getAllByRole('button', { name: 'Login' });
        const submitButton = loginButtons.find(button => button.getAttribute('type') === 'submit');
        fireEvent.click(submitButton!);

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
            expect(mockOnAuthSuccess).not.toHaveBeenCalled();
        });
    });

    it('handles Google login success', async () => {
        (authService.loginWithGoogle as any).mockResolvedValue({ ok: true });

        render(
            <AuthModal
                isOpen={true}
                onClose={mockOnClose}
                onAuthSuccess={mockOnAuthSuccess}
            />
        );

        fireEvent.click(screen.getByText('Sign in with Google'));

        await waitFor(() => {
            expect(authService.loginWithGoogle).toHaveBeenCalledWith('mock-token');
            expect(mockOnAuthSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
        });
    });
});
