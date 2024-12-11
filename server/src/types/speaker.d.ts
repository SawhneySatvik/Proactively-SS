export interface Speaker {
    user_id: number;
    expertise?: string;
    price_per_session?: number;
}

export interface SpeakerResult {
    user_id: number;
    first_name: string;
    last_name: string;
    expertise: string;
    price_per_session: number;
}
