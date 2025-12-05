import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '../src/hooks/useUser';
import Button from './ui/Button';
import { useToast } from '../contexts/ToastContext';

interface UserData {
    id: string;
    email: string;
    subscription_status: 'free' | 'pro';
    is_admin: boolean;
    created_at: string;
    google_id: string | null;
}

const AdminDashboard: React.FC = () => {
    const { data: currentUser } = useUser();
    const { addToast } = useToast();
    const queryClient = useQueryClient();

    const fetchUsers = async (): Promise<UserData[]> => {
        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`, // Fallback if using token, but we rely on cookies mostly
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        return data.users;
    };

    const { data: users, isLoading, error } = useQuery({
        queryKey: ['admin', 'users'],
        queryFn: fetchUsers,
    });

    const updateUserStatusMutation = useMutation({
        mutationFn: async ({ userId, status }: { userId: string; status: 'free' | 'pro' }) => {
            const response = await fetch(`/api/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscription_status: status }),
            });
            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            addToast('User status updated successfully', 'success');
        },
        onError: () => {
            addToast('Failed to update user status', 'error');
        },
    });

    const handleToggleStatus = (user: UserData) => {
        const newStatus = user.subscription_status === 'free' ? 'pro' : 'free';
        if (confirm(`Are you sure you want to change ${user.email}'s status to ${newStatus}?`)) {
            updateUserStatusMutation.mutate({ userId: user.id, status: newStatus });
        }
    };

    if (isLoading) return <div className="text-center p-8">Loading users...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error loading users.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-white">Admin Dashboard</h1>

            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                        <thead className="bg-gray-900 text-gray-400 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users?.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-750 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.subscription_status === 'pro'
                                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                                : 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
                                            }`}>
                                            {user.subscription_status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.is_admin ? (
                                            <span className="text-blue-400 font-bold flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                                Admin
                                            </span>
                                        ) : 'User'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {!user.is_admin && (
                                            <Button
                                                size="sm"
                                                variant={user.subscription_status === 'free' ? 'primary' : 'secondary'}
                                                onClick={() => handleToggleStatus(user)}
                                                disabled={updateUserStatusMutation.isPending}
                                            >
                                                {user.subscription_status === 'free' ? 'Upgrade to Pro' : 'Downgrade'}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
