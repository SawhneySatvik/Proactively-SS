import db from '../config/database';
import { Client } from '../types/client';

// Helper function to parse database rows into a Client object
const parseClient = (row: any): Client => ({
    user_id: row.user_id, // Ensure this is only called if `row` exists
});

// Create a new client
export const createClient = async (client: Client): Promise<void> => {
    const query = `
        INSERT INTO clients (user_id)
        VALUES (?)
    `;
    const values = [client.user_id];
    return new Promise((resolve, reject) => {
        db.run(query, values, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

// Get client by user ID
export const getClientByUserId = async (user_id: number): Promise<Client | undefined> => {
    const query = `SELECT * FROM clients WHERE user_id = ?`;
    return new Promise((resolve, reject) => {
        db.get(query, [user_id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(parseClient(row)); // Call parseClient only if `row` exists
            } else {
                resolve(undefined); // Explicitly return undefined if no row found
            }
        });
    });
};
