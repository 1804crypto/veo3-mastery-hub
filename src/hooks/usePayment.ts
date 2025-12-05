import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';

interface CreateCheckoutSessionParams {
    planId: string;
}

interface CreateCheckoutSessionResponse {
    sessionId: string;
    ok: boolean;
    message?: string;
}

const createCheckoutSession = async ({ planId }: CreateCheckoutSessionParams): Promise<CreateCheckoutSessionResponse> => {
    return api.post<CreateCheckoutSessionResponse>('/api/payments/create-checkout-session', { planId });
};

export const useCreateCheckoutSession = () => {
    return useMutation({
        mutationFn: createCheckoutSession,
    });
};
