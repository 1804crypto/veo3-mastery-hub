export class ApiClient {
    private baseUrl: string;

    constructor() {
        // Prioritize VITE_APP_API_URL (verified working) -> VITE_API_URL (clean but maybe sleeping/wrong) -> VITE_API_BASE_URL (legacy)
        this.baseUrl = import.meta.env.VITE_APP_API_URL || import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://veo3-mastery-hubveo3-mastery-hub-api.onrender.com';
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        };

        const config: RequestInit = {
            ...options,
            headers,
            credentials: 'include', // Always send cookies
        };


        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                // Handle 401 specifically - silently, caller handles it

                const errorBody = await response.text();
                console.error(`[API Error] Status: ${response.status}, Body: ${errorBody}`);

                try {
                    const errorJson = JSON.parse(errorBody);
                    throw { status: response.status, ...errorJson };
                } catch (e) {
                    throw { status: response.status, message: errorBody || 'Unknown Error' };
                }
            }

            // Handle 204 No Content
            if (response.status === 204) {
                return {} as T;
            }

            const data = await response.json();
            return data as T;
        } catch (error) {
            console.error('[API Network/System Error]', error);
            throw error;
        }
    }

    get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET', headers });
    }

    post<T>(endpoint: string, body: unknown, headers?: HeadersInit): Promise<T> {
        return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), headers });
    }

    put<T>(endpoint: string, body: unknown, headers?: HeadersInit): Promise<T> {
        return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), headers });
    }

    delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE', headers });
    }
}

export const api = new ApiClient();
