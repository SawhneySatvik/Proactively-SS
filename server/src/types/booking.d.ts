export interface Booking {
    id: number;
    client_id: number;
    speaker_id: number;
    session_datetime: string;
    created_at: string;
    updated_at: string;
}

export interface Session {
    booking_id: number;
    client_name: string;
    session_datetime: string;
}