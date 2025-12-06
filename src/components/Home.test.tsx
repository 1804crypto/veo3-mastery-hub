import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

// Mock useNavigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});

describe('Home Component', () => {
    it('renders hero section', () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
        expect(screen.getByText('Unlock Hollywood-Grade AI Video')).toBeInTheDocument();
        expect(screen.getByText('Start the Learning Journey')).toBeInTheDocument();
    });

    it('renders feature cards', () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
        expect(screen.getByText('Guided Learning Journey')).toBeInTheDocument();
        expect(screen.getByText('AI Prompt Generator')).toBeInTheDocument();
        expect(screen.getByText('Pro Community Hub')).toBeInTheDocument();
    });
});
