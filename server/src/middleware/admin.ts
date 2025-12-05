import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ ok: false, message: 'Unauthorized. Please log in.' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { is_admin: true },
        });

        if (!user || !user.is_admin) {
            return res.status(403).json({ ok: false, message: 'Access denied. Admin privileges required.' });
        }

        next();
    } catch (error) {
        console.error('Admin verification error:', error);
        res.status(500).json({ ok: false, message: 'Internal server error during admin verification.' });
    }
};
