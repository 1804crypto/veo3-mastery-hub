import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '../types';

interface UserResponse {
    user: User;
}

const fetchUser = async (): Promise<User | null> => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://veo3-mastery-hubveo3-mastery-hub-api.onrender.com';
    const response = await fetch(`${apiUrl}/api/me`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        if (response.status === 401) {
            return null;
        }
        throw new Error('Failed to fetch user');
    }

    const data: UserResponse = await response.json();
    return data.user;
};

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useInvalidateUser = () => {
    const queryClient = useQueryClient();
    return () => queryClient.invalidateQueries({ queryKey: ['user'] });
};

export const useSetUser = () => {
    const queryClient = useQueryClient();
    return (user: User | null) => queryClient.setQueryData(['user'], user);
};
