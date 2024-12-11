import { Request, Response } from 'express';
import { getUserByEmail } from '../models/userModel';
import { verifyPassword } from '../utils/helpers';
import { generateToken } from '../utils/jwtUtils';

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await getUserByEmail(email);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = generateToken({ id: user.id, role: user.role });
        res.status(200).json({ token });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
