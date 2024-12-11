import express from 'express';
import { getBookingById, updateBooking, deleteBooking } from '../models/bookingModel';
import { authenticate } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';
import { getSessionsBySpeaker } from '../controllers/sessionController';
import { createBookingController } from '../controllers/bookingController';

const router = express.Router();

// Create a booking (Only clients)
router.post('/', authenticate, checkRole(['client']), createBookingController);

// Get Booking by ID (Authenticated users)
router.get('/:id', authenticate, async (req, res) => {
    try {
        const booking = await getBookingById(Number(req.params.id));
        if (booking) res.status(200).json(booking);
        else res.status(404).json({ message: 'Booking not found' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Update Booking 
router.put('/:id', authenticate, async (req, res) => {
    try {
        await updateBooking(Number(req.params.id), req.body);
        res.status(200).json({ message: 'Booking updated successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Booking 
router.delete('/:id', authenticate, async (req, res) => {
    try {
        await deleteBooking(Number(req.params.id));
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

//Sessions by speaker_id and date
router.get('/sessions/:speaker_id/:date', authenticate, getSessionsBySpeaker);

export default router;
