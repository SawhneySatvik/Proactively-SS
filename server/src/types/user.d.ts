export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: 'client' | 'speaker';
    verified: boolean;
    created_at: string;
    updated_at: string;
}
