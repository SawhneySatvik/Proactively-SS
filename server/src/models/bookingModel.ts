import db from '../config/database';
import { Booking, Session } from '../types/booking';

// Helper function to parse database rows into a Booking object
const parseBooking = (row: any): Booking => ({
    id: row.id,
    client_id: row.client_id,
    speaker_id: row.speaker_id,
    session_datetime: row.session_datetime,
    created_at: row.created_at,
    updated_at: row.updated_at,
});

const parseSession = (row: any): Session => ({
    booking_id: row.booking_id,
    client_name: row.client_name,
    session_datetime: row.session_datetime,
})

// Create a new booking
export const createBooking = async (booking: Booking): Promise<number> => {
    const checkQuery = `
        SELECT COUNT(*) AS count 
        FROM bookings 
        WHERE speaker_id = ? AND session_datetime = ?
    `;
    const insertQuery = `
        INSERT INTO bookings (client_id, speaker_id, session_datetime)
        VALUES (?, ?, ?)
    `;
    const checkValues = [booking.speaker_id, booking.session_datetime];
    const insertValues = [booking.client_id, booking.speaker_id, booking.session_datetime];

    return new Promise((resolve, reject) => {
        // Check for duplicate bookings
        db.get(checkQuery, checkValues, (err, row) => {
            if (err) {
                reject(err);
            } else {
                // Insert the booking
                db.run(insertQuery, insertValues, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
            }
        });
    });
};

// Get booking by ID
export const getBookingById = async (id: number): Promise<Booking | undefined> => {
    const query = `SELECT * FROM bookings WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.get(query, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(parseBooking(row));
            } else {
                resolve(undefined);
            }
        });
    });
};

// Update booking
export const updateBooking = async (id: number, updates: Partial<Booking>): Promise<void> => {
    const query = `
        UPDATE bookings
        SET session_datetime = COALESCE(?, session_datetime)
        WHERE id = ?
    `;
    const values = [updates.session_datetime, id];
    return new Promise((resolve, reject) => {
        db.run(query, values, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

// Delete booking
export const deleteBooking = async (id: number): Promise<void> => {
    const query = `DELETE FROM bookings WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.run(query, [id], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

// Fetch all sessions for a speaker on a specific date, sorted by time
export const getSessionsBySpeakerAndDate = async (speaker_id: number, session_date: string): Promise<Session[]> => {
    const query = `
        SELECT 
            bookings.id AS booking_id,
            clients.first_name || ' ' || clients.last_name AS client_name,
            bookings.session_datetime
        FROM bookings
        INNER JOIN users AS clients ON clients.id = bookings.client_id
        WHERE bookings.speaker_id = ? AND DATE(bookings.session_datetime) = ?
        ORDER BY bookings.session_datetime ASC
    `;

    return new Promise((resolve, reject) => {
        db.all(query, [speaker_id, session_date], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const results = rows.map((row: any) => parseSession(row));
                resolve(results);
            }
        });
    });
};