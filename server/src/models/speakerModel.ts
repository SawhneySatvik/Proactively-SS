import db from '../config/database';
import { Speaker, SpeakerResult } from '../types/speaker';

// Helper function to parse database rows into a Speaker object
const parseSpeaker = (row: any): Speaker => ({
    user_id: row.user_id,
    expertise: row.expertise,
    price_per_session: row.price_per_session,
});

const parseSpeakerResult = (row: any): SpeakerResult => ({
    user_id: row.user_id,
    first_name: row.first_name,
    last_name: row.last_name,
    expertise: row.expertise,
    price_per_session: row.price_per_session,
});

// Create a new speaker
export const createSpeaker = async (speaker: Speaker): Promise<void> => {
    const query = `
        INSERT INTO speakers (user_id, expertise, price_per_session)
        VALUES (?, ?, ?)
    `;
    const values = [speaker.user_id, speaker.expertise, speaker.price_per_session];
    return new Promise((resolve, reject) => {
        db.run(query, values, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

// Get speaker by user ID
export const getSpeakerByUserId = async (user_id: number): Promise<Speaker | undefined> => {
    const query = `SELECT * FROM speakers WHERE user_id = ?`;
    return new Promise((resolve, reject) => {
        db.get(query, [user_id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(parseSpeaker(row));
            } else {
                resolve(undefined);
            }
        });
    });
};

// Update speaker
export const updateSpeaker = async (user_id: number, updates: Partial<Speaker>): Promise<void> => {
    const query = `
        UPDATE speakers
        SET expertise = COALESCE(?, expertise),
            price_per_session = COALESCE(?, price_per_session)
        WHERE user_id = ?
    `;
    const values = [updates.expertise, updates.price_per_session, user_id];
    return new Promise((resolve, reject) => {
        db.run(query, values, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

// Delete speaker
export const deleteSpeaker = async (user_id: number): Promise<void> => {
    const query = `DELETE FROM speakers WHERE user_id = ?`;
    return new Promise((resolve, reject) => {
        db.run(query, [user_id], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};


export const getAllSpeakers = async (): Promise<SpeakerResult[]> => {
    const query = `
        SELECT 
            users.id,
            users.first_name,
            users.last_name,
            speakers.expertise,
            speakers.price_per_session
        FROM speakers
        INNER JOIN users ON users.id = speakers.user_id
    `;

    return new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            else {
                const results = rows.map((row: any) => parseSpeakerResult(row));
                resolve(results)
            };
        });
    });
};