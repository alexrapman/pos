// backend/src/middleware/eventTracking.ts
import { Request, Response, NextFunction } from 'express';
import EventTracker from '../services/EventTracker';

export const trackEvent = (eventType: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const originalSend = res.send;
        res.send = function (body: any) {
            EventTracker.trackEvent(eventType, {
                path: req.path,
                method: req.method,
                body: req.body,
                response: body,
                userId: req.user?.id
            });
            return originalSend.call(this, body);
        };
        next();
    };
};