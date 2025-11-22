import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCurrentUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    // This should be caught by the verifyAuth middleware, but serves as a safeguard
    return res.status(401).json({ ok: false, message: 'Authentication required.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        subscription_status: true,
      },
    });

    if (!user) {
      return res.status(404).json({ ok: false, message: 'User not found.' });
    }

    res.status(200).json({ ok: true, user });
  } catch (error) {
    console.error(`Failed to fetch user data for user ${userId}:`, error);
    res.status(500).json({ ok: false, message: 'Internal server error.' });
  }
};
