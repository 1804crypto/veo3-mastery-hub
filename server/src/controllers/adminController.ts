import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                subscription_status: true,
                is_admin: true,
                created_at: true,
                google_id: true,
            },
            orderBy: { created_at: 'desc' },
        });

        res.json({ ok: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ ok: false, message: 'Failed to fetch users' });
    }
};

export const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { subscription_status } = req.body;

        if (!['free', 'pro'].includes(subscription_status)) {
            return res.status(400).json({ ok: false, message: 'Invalid status. Must be "free" or "pro".' });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { subscription_status },
            select: { id: true, email: true, subscription_status: true },
        });

        res.json({ ok: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ ok: false, message: 'Failed to update user status' });
    }
};
