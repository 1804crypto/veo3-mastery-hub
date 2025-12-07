import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

interface JwtPayload {
    id: string;
    email: string;
}

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1. Check for token in httpOnly cookie
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // 2. If not in cookie, check Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        // No token, proceed as guest
        return next();
    }

    if (!JWT_SECRET) {
        // Should not happen if env is validated, but safe fallback
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = { id: decoded.id, email: decoded.email };
        next();
    } catch (error) {
        // Invalid token, treat as guest (or could Warn)
        // For optional auth, we just proceed without setting req.user
        next();
    }
};
