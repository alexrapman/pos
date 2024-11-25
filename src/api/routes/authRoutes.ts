// src/api/routes/authRoutes.ts
import { Router } from 'express';
import { AuthService } from '../../services/AuthService';
import { UserRole } from '../../models/User';
import { validateAuth } from '../middleware/validateAuth';

const router = Router();
const authService = new AuthService();

router.post('/login', validateAuth, async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const token = await authService.login(username, password);
        res.json({ token });
    } catch (error) {
        next(error);
    }
});

router.post('/register', validateAuth, async (req, res, next) => {
    try {
        const { username, password, role } = req.body;
        const user = await authService.register(username, password, role as UserRole);
        res.status(201).json({
            id: user.id,
            username: user.username,
            role: user.role
        });
    } catch (error) {
        next(error);
    }
});

export { router as authRouter };