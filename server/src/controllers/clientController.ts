import { Request, Response } from 'express';
import { getUserById } from '../models/userModel';
import { createClient, getClientByUserId } from '../models/clientModel';

export const assignClientController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id } = req.body;
        const user = await getUserById(user_id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (user.role !== 'client') {
            res.status(400).json({ message: 'User is not a client' });
            return;
        }

        await createClient({ user_id });
        res.status(201).json({ message: 'Client assigned successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getClientController = async (req: Request, res: Response): Promise<void> => {
    try {
        const client = await getClientByUserId(Number(req.params.user_id));
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
