import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateVEO3Prompt } from '../../services/geminiService';
import { PromptHistoryItem, VEO3Prompt } from '../types';

// --- History Management (Backend API) ---

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getHistory = async (_userId: string): Promise<PromptHistoryItem[]> => {
    const response = await fetch(`${API_BASE_URL}/api/prompts`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch prompt history');
    }

    const data = await response.json();
    return data;
};

const addHistoryItem = async ({ userId: _userId, item }: { userId: string; item: Omit<PromptHistoryItem, 'id'> }) => {
    const response = await fetch(`${API_BASE_URL}/api/prompts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(item),
    });

    if (!response.ok) {
        throw new Error('Failed to save prompt');
    }

    return response.json();
};

const deleteHistoryItem = async ({ userId: _userId, id }: { userId: string; id: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/prompts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to delete prompt');
    }

    return response.json();
};

const clearHistory = async (userId: string) => {
    // Delete all prompts for this user
    const history = await getHistory(userId);
    await Promise.all(
        history.map(item =>
            fetch(`${API_BASE_URL}/api/prompts/${item.id}`, {
                method: 'DELETE',
                credentials: 'include',
            })
        )
    );
    return [];
};

// --- Hooks ---

export const useGeneratePrompt = () => {
    return useMutation({
        mutationFn: generateVEO3Prompt,
    });
};

export const usePromptHistory = (userId: string | null) => {
    return useQuery({
        queryKey: ['promptHistory', userId],
        queryFn: () => getHistory(userId!),
        enabled: !!userId,
    });
};

export const useAddPromptHistory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addHistoryItem,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['promptHistory', variables.userId] });
        },
    });
};

export const useDeletePromptHistory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteHistoryItem,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['promptHistory', variables.userId] });
        },
    });
};

export const useClearPromptHistory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clearHistory,
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: ['promptHistory', userId] });
        },
    });
};
