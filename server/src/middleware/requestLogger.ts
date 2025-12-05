import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const { method, url, body, query } = req;

    console.log(`[Request] ${method} ${url}`);
    if (Object.keys(body).length > 0) {
        console.log(`[Body]`, JSON.stringify(body, null, 2));
    }
    if (Object.keys(query).length > 0) {
        console.log(`[Query]`, JSON.stringify(query, null, 2));
    }

    // Capture response status
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[Response] ${method} ${url} ${res.statusCode} - ${duration}ms`);
    });

    next();
};
