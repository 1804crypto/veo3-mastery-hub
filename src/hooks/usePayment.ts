import { useMutation } from '@tanstack/react-query';

interface CreateCheckoutSessionParams {
    planId: string;
}

interface CreateCheckoutSessionResponse {
    sessionId: string;
    ok: boolean;
    message?: string;
}

const createCheckoutSession = async ({ planId }: CreateCheckoutSessionParams): Promise<CreateCheckoutSessionResponse> => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ planId }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Failed to create checkout session.');
    }

    return data;
};

export const useCreateCheckoutSession = () => {
    return useMutation({
        mutationFn: createCheckoutSession,
    });
};
