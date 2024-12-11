import { createUser, getUserById, updateUser, deleteUser } from '../models/userModel';
import { Request, Response } from 'express';

export const createUserController = async (req:Request, res:Response) => {
    try {
        const userId = await createUser(req.body);
        res.status(201).json({ message: 'User created successfully', id: userId });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserController = async (req:Request, res:Response) => {
    try {
        const user = await getUserById(Number(req.params.id));
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updateUserController = async (req:Request, res:Response) => {
    try {
        await updateUser(Number(req.params.id), req.body);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteUserController = async (req:Request, res:Response) => {
    try {
        await deleteUser(Number(req.params.id));
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
