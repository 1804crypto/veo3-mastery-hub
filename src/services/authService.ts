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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://veo3-mastery-hubveo3-mastery-hub-api.onrender.com';
console.log('AuthService initialized with API_BASE_URL:', API_BASE_URL);

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

interface GoogleUserInfo {
    sub?: string;
    email?: string;
    name?: string;
    picture?: string;
}

export const loginWithGoogle = async (token: string, userInfo?: GoogleUserInfo): Promise<AuthResponse> => {
    try {
        console.log(`[AuthService] Sending Google login request to: ${API_BASE_URL}/api/auth/google`);

        // If userInfo is provided, we're using the implicit flow (access_token)
        // Otherwise, we're using the id_token flow
        const body = userInfo
            ? { accessToken: token, userInfo }
            : { token };

        const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            credentials: 'include', // Necessary to receive the httpOnly cookie
        });

        if (!response.ok) {
            const text = await response.text();
            console.error(`[AuthService] Google login failed with status ${response.status}:`, text);
            try {
                return JSON.parse(text);
            } catch (e) {
                return { ok: false, message: `Server error (${response.status}): ${text.substring(0, 100)}` };
            }
        }
        return response.json();
    } catch (error) {
        console.error('[AuthService] Network error during Google login:', error);
        return { ok: false, message: 'Network connection failed' };
    }
};

export const logoutUser = async (): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Necessary to send the cookie to be cleared
    });
    return response.json();
};
