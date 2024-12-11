import { Request, Response } from 'express';
import { getUserById } from '../models/userModel';
import { createSpeaker, getSpeakerByUserId, getAllSpeakers } from '../models/speakerModel';

export const assignSpeakerController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id, expertise, price_per_session } = req.body;
        const user = await getUserById(user_id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (user.role !== 'speaker') {
            res.status(400).json({ message: 'User is not a speaker' });
            return;
        }

        await createSpeaker({ user_id, expertise, price_per_session });
        res.status(201).json({ message: 'Speaker assigned successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getSpeakerController = async (req: Request, res: Response): Promise<void> => {
    try {
        const speaker = await getSpeakerByUserId(Number(req.params.user_id));
        if (speaker) {
            res.status(200).json(speaker);
        } else {
            res.status(404).json({ message: 'Speaker not found' });
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllSpeakersController = async (req: Request, res: Response): Promise<void> => {
    try {
        const speakers = await getAllSpeakers();
        res.status(200).json(speakers);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};