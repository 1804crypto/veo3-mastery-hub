// Define types for request/response for clarity
interface AuthResponse {
    ok: boolean;
    message: string;
    userId?: string;
    user?: {
        id: string;
        email: string;
        name?: string | null;
        picture?: string | null;
    };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://veo3-backend.onrender.com';

export const registerUser = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Necessary to receive the httpOnly cookie
    });
    return response.json();
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Necessary to receive the httpOnly cookie
    });
    return response.json();
};

export const loginWithGoogle = async (googleToken: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken }),
        credentials: 'include', // Necessary to receive the httpOnly cookie
    });
    return response.json();
};

export const logoutUser = async (): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Necessary to send the cookie to be cleared
    });
    return response.json();
};
