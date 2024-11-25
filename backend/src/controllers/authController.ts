// src/controllers/AuthController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/User';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await User.create({
        username,
        password: hashedPassword,
        role
      });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      return res.status(201).json({ user, token });
    } catch (error) {
      return res.status(400).json({ error: 'Registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      return res.json({ token });
    } catch (error) {
      return res.status(500).json({ error: 'Login failed' });
    }
  }
}