// src/services/AuthService.ts
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/User';

export class AuthService {
    async login(username: string, password: string): Promise<string> {
        const user = await User.findOne({ where: { username } });

        if (!user || !(await user.validatePassword(password))) {
            throw new Error('Invalid credentials');
        }

        return jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );
    }

    async register(username: string, password: string, role: UserRole): Promise<User> {
        return User.create({ username, password, role });
    }
}