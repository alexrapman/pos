// backend/src/routes/notificationRoutes.ts
import { Router } from 'express';
import { NotificationService } from '../services/NotificationService';

const router = Router();
const notificationService = new NotificationService();

router.get('/', (req, res) => {
    res.json(notificationService.getNotifications());
});

router.post('/', (req, res) => {
    const { type, message } = req.body;
    notificationService.createNotification(type, message);
    res.sendStatus(201);
});

export default router;