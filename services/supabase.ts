import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables. Please check your .env.local file.'
    );
}

// Function to create a Supabase client with the user's access token
export const createSupabaseClient = (accessToken?: string) => {
    const options = accessToken
        ? {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        }
        : {};

    return createClient(supabaseUrl, supabaseAnonKey, options);
};

// Default entry point, will need token injected for RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to sync Clerk user to Supabase
export async function syncUserToSupabase(
    clerkUser: {
        id: string;
        primaryEmailAddress?: { emailAddress: string } | null;
        fullName?: string | null;
    },
    token: string
) {
    const client = createSupabaseClient(token);

    const { error } = await client.from('users').upsert(
        {
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            full_name: clerkUser.fullName || null,
            updated_at: new Date().toISOString(),
        },
        {
            onConflict: 'id',
        }
    );

    if (error) {
        console.error('Error syncing user to Supabase:', error);
    }
}
