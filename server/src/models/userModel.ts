import db from '../config/database';
import { User } from '../types/user';

import { hashPassword, verifyPassword } from '../utils/helpers';

const parseUser = (row: any): User => ({
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    password: row.password,
    role: row.role,
    verified: row.verified === 1,
    created_at: row.created_at,
    updated_at: row.updated_at,
});

// Create a new user
export const createUser = async (user: User): Promise<number> => {

    const hashedPassword = await hashPassword(user.password);

    const query = `
        INSERT INTO users (first_name, last_name, email, password, role, verified)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [user.first_name, user.last_name, user.email, hashedPassword, user.role, user.verified ? 1 : 0];

    return new Promise((resolve, reject) => {
        db.run(query, values, function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
};

// Get user by ID
export const getUserById = async (id: number): Promise<User | undefined> => {
    const query = `SELECT * FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.get(query, [id], (err, row) => {
            if (err) reject(err);
            else resolve(parseUser(row) || undefined);
        });
    });
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    const query = `SELECT * FROM users WHERE email = ?`;
    return new Promise((resolve, reject) => {
        db.get(query, [email], (err, row) => {
            if (err) reject(err);
            else resolve(parseUser(row) || undefined);
        });
    });
};

// Update user
export const updateUser = async (id: number, updates: Partial<User>): Promise<void> => {
    const query = `
        UPDATE users
        SET first_name = COALESCE(?, first_name),
            last_name = COALESCE(?, last_name),
            email = COALESCE(?, email),
            password = COALESCE(?, password),
            role = COALESCE(?, role),
            verified = COALESCE(?, verified),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    const values = [
        updates.first_name,
        updates.last_name,
        updates.email,
        updates.password,
        updates.role,
        updates.verified,
        id,
    ];
    return new Promise((resolve, reject) => {
        db.run(query, values, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

// Delete user
export const deleteUser = async (id: number): Promise<void> => {
    const query = `DELETE FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.run(query, [id], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};
