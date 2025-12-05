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
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6 font-sans">
                    <div className="max-w-xl w-full text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Something went wrong
                        </h1>

                        <p className="text-gray-400 text-lg max-w-md mx-auto">
                            We apologize for the inconvenience. An unexpected error has occurred in the application.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-8 text-left">
                                <details className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                                    <summary className="px-4 py-3 cursor-pointer bg-gray-800 hover:bg-gray-750 transition-colors text-yellow-500 font-medium flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Error Details (Development Only)
                                    </summary>
                                    <div className="p-4 bg-gray-900/50 overflow-auto max-h-64 text-sm font-mono text-gray-300 border-t border-gray-700">
                                        <p className="text-red-400 mb-2 font-bold">{this.state.error.toString()}</p>
                                        <div className="whitespace-pre-wrap opacity-75">
                                            {this.state.errorInfo?.componentStack}
                                        </div>
                                    </div>
                                </details>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                            <button
                                onClick={this.handleReset}
                                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/20 flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.051M20 20v-5h-.051M9 17h6M15 7H9" />
                                </svg>
                                Reload Page
                            </button>

                            <a
                                href="/"
                                className="w-full sm:w-auto px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-lg transition-all duration-200 border border-gray-700 flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Go Home
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
