import { Request } from 'express';
import { SupabaseClient, User } from '@supabase/supabase-js';

export interface AuthenticateRequest extends Request {
    user: User;
    supabase: SupabaseClient;
}