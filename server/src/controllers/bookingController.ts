import { Request, Response } from 'express';
import { createBooking } from '../models/bookingModel';
import { getUserById } from '../models/userModel';
import { sendEmail } from '../services/emailService';

export const createBookingController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { client_id, speaker_id, session_datetime } = req.body;

        // Input validation
        if (!client_id || !speaker_id || !session_datetime) {
            res.status(400).json({ message: 'Missing required fields: client_id, speaker_id, and session_datetime are required.' });
            return;
        }

        // Validate session_datetime is in the future
        const sessionDate = new Date(session_datetime);
        if (isNaN(sessionDate.getTime()) || sessionDate <= new Date()) {
            res.status(400).json({ message: 'Invalid session_datetime: Must be a valid future date and time.' });
            return;
        }

        // Create the booking
        const bookingId = await createBooking(req.body);

        // Fetch client and speaker details
        const [client, speaker] = await Promise.all([getUserById(client_id), getUserById(speaker_id)]);
        if (!client || !speaker) {
            res.status(404).json({ message: 'Client or Speaker not found.' });
            return;
        }

        const sessionDateTime = sessionDate.toLocaleString();

        // Prepare email content
        const speakerEmailContent = {
            to: speaker.email,
            subject: 'New Session Booking',
            text: `You have a new session booked by ${client.first_name} ${client.last_name} on ${sessionDateTime}.`,
            html: `<p>You have a new session booked by <strong>${client.first_name} ${client.last_name}</strong> on <strong>${sessionDateTime}</strong>.</p>`,
        };

        const clientEmailContent = {
            to: client.email,
            subject: 'Session Booking Confirmation',
            text: `Your session with ${speaker.first_name} ${speaker.last_name} has been confirmed for ${sessionDateTime}.`,
            html: `<p>Your session with <strong>${speaker.first_name} ${speaker.last_name}</strong> has been confirmed for <strong>${sessionDateTime}</strong>.</p>`,
        };

        // Send emails concurrently
        await Promise.all([
            sendEmail(speakerEmailContent.to, speakerEmailContent.subject, speakerEmailContent.text, speakerEmailContent.html),
            sendEmail(clientEmailContent.to, clientEmailContent.subject, clientEmailContent.text, clientEmailContent.html),
        ]);

        // Respond with success
        res.status(201).json({ message: 'Booking created successfully', bookingId });
    } catch (err: any) {
        // Handle specific errors
        if (err.message.includes('Speaker is already booked')) {
            res.status(409).json({ message: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
};
