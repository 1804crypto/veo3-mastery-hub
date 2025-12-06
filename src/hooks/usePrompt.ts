import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateVEO3Prompt } from '../services/geminiService';
import { PromptHistoryItem } from '../types';
import { api } from '../lib/api';

// --- History Management (Backend API) ---

// --- History Management (Backend API) ---

const getHistory = async (_userId: string): Promise<PromptHistoryItem[]> => {
    return api.get<PromptHistoryItem[]>('/api/prompts');
};

const addHistoryItem = async ({ userId: _userId, item }: { userId: string; item: Omit<PromptHistoryItem, 'id'> }) => {
    return api.post('/api/prompts', item);
};

const deleteHistoryItem = async ({ userId: _userId, id }: { userId: string; id: string }) => {
    return api.delete(`/api/prompts/${id}`);
};

const clearHistory = async (userId: string) => {
    // Delete all prompts for this user
    const history = await getHistory(userId);
    await Promise.all(
        history.map(item =>
            api.delete(`/api/prompts/${item.id}`)
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
