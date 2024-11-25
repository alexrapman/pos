// backend/src/middleware/BatchRequestMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const batchRequests = () => {
    const batchQueue = new Map<string, Promise<any>>();

    return async (req: Request, res: Response, next: NextFunction) => {
        const cacheKey = `${req.path}-${JSON.stringify(req.query)}`;

        if (batchQueue.has(cacheKey)) {
            const result = await batchQueue.get(cacheKey);
            return res.json(result);
        }

        const promise = new Promise((resolve) => {
            next();
            resolve(res.locals.result);
        });

        batchQueue.set(cacheKey, promise);
        setTimeout(() => batchQueue.delete(cacheKey), 100);

        const result = await promise;
        res.json(result);
    };
};