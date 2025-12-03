import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

const renderHeader = (props: Record<string, unknown> = {}) => {
    const defaultProps = {
        isAuthenticated: false,
        hasAccess: false,
        onAuthClick: vi.fn(),
        onLogout: vi.fn(),
        onUpgradeClick: vi.fn(),
        userEmail: null,
        ...props,
    };

    return render(
        <BrowserRouter>
            <Header {...defaultProps} />
        </BrowserRouter>
    );
};

describe('Header Component', () => {
    it('renders logo and navigation links', () => {
        renderHeader();
        expect(screen.getByText('Mastery Hub')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Journey')).toBeInTheDocument();
    });

    it('shows Login/Signup when not authenticated', () => {
        renderHeader({ isAuthenticated: false });
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    it('shows User Profile and Logout when authenticated', () => {
        renderHeader({ isAuthenticated: true, userEmail: 'test@example.com' });
        const userButton = screen.getByRole('button', { name: /User Account/i });
        fireEvent.click(userButton);
        expect(screen.getAllByText('Logout').length).toBeGreaterThan(0);
    });

    it('shows Upgrade button when authenticated but no access', () => {
        renderHeader({ isAuthenticated: true, hasAccess: false });
        expect(screen.getByText('Upgrade to Pro')).toBeInTheDocument();
    });

    it('does not show Upgrade button when user has access', () => {
        renderHeader({ isAuthenticated: true, hasAccess: true });
        expect(screen.queryByText('Upgrade to Pro')).not.toBeInTheDocument();
    });
});
