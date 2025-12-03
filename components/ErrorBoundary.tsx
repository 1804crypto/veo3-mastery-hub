import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches React errors in production and displays a fallback UI
 */
class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console in development
        console.error('Error Boundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // In production, you could send this to an error tracking service
        // Example: Sentry.captureException(error, { extra: errorInfo });
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
        // Optionally reload the page
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#111827',
                    color: 'white',
                    fontFamily: 'sans-serif',
                    padding: '40px',
                }}>
                    <div style={{ maxWidth: '600px', textAlign: 'center' }}>
                        <h1 style={{ color: '#ef4444', fontSize: '2rem', marginBottom: '1rem' }}>
                            Oops! Something went wrong
                        </h1>
                        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
                            We&apos;re sorry for the inconvenience. An unexpected error occurred.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details style={{
                                backgroundColor: '#1f2937',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '2rem',
                                textAlign: 'left',
                                border: '1px solid #374151',
                            }}>
                                <summary style={{ cursor: 'pointer', marginBottom: '1rem', color: '#f59e0b' }}>
                                    Error Details (Development Only)
                                </summary>
                                <pre style={{
                                    fontSize: '0.875rem',
                                    overflow: 'auto',
                                    color: '#e5e7eb',
                                }}>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <button
                            onClick={this.handleReset}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
