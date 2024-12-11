import { Request, Response } from 'express';
import { getSessionsBySpeakerAndDate } from '../models/bookingModel';

export const getSessionsBySpeaker = async (req: Request, res: Response): Promise<void> => {
    try {
        const { speaker_id, date } = req.params;

        if (!speaker_id || !date) {
            res.status(400).json({ message: 'Missing required parameters: speaker_id and date are required.' });
            return;
        }

        const speakerId = Number(speaker_id);
        if (isNaN(speakerId)) {
            res.status(400).json({ message: 'Invalid parameter: speaker_id must be a number.' });
            return;
        }

        const sessions = await getSessionsBySpeakerAndDate(speakerId, date);

        res.status(200).json(sessions);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};