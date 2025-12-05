import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '../types';
import { api } from '../lib/api';

interface UserResponse {
    user: User;
}

const fetchUser = async (): Promise<User | null> => {
    try {
        const data: UserResponse = await api.get('/api/me');
        return data.user;
    } catch (error: any) {
        if (error.status === 401) {
            return null;
        }
        throw error;
    }
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
