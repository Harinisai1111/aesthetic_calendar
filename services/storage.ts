import { createSupabaseClient } from './supabase';

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name ('photos' or 'voice-notes')
 * @param userId - The user ID (for folder organization)
 * @param token - Clerk authentication token
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
    file: File,
    bucket: 'photos' | 'voice-notes',
    userId: string,
    token: string
): Promise<string> {
    const client = createSupabaseClient(token);

    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload the file
    const { data, error } = await client.storage
        .from(bucket)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        console.error('Error uploading file:', error);
        throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = client.storage
        .from(bucket)
        .getPublicUrl(data.path);

    return publicUrl;
}

/**
 * Delete a file from Supabase Storage
 * @param url - The public URL of the file to delete
 * @param bucket - The storage bucket name
 * @param token - Clerk authentication token
 */
export async function deleteFile(
    url: string,
    bucket: 'photos' | 'voice-notes',
    token: string
): Promise<void> {
    const client = createSupabaseClient(token);

    // Extract the file path from the URL
    const urlParts = url.split(`/${bucket}/`);
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];

    const { error } = await client.storage
        .from(bucket)
        .remove([filePath]);

    if (error) {
        console.error('Error deleting file:', error);
    }
}

/**
 * Convert a File to a data URL for preview
 */
export function fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
