import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Entry } from '../types';
import { createSupabaseClient } from './supabase';

export const useEntries = () => {
  const { userId, getToken, isLoaded } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load entries from Supabase
  const loadEntries = useCallback(async () => {
    if (!userId || !isLoaded) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      // Get the Supabase token from Clerk
      const token = await getToken({ template: 'supabase' });
      if (!token) {
        console.error('No Supabase token found');
        return;
      }

      const client = createSupabaseClient(token);

      const { data, error } = await client
        .from('entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to Entry format
      const transformedEntries: Entry[] = (data || []).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        date: row.date,
        title: row.title,
        caption: row.caption || '',
        photos: row.photos || [],
        mood: row.mood,
        hashtags: row.hashtags || [],
        songUrl: row.song_url || undefined,
        voiceNote: row.voice_note || undefined,
        createdAt: new Date(row.created_at).getTime(),
      }));

      setEntries(transformedEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [userId, isLoaded, getToken]);

  // Initial load
  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const addEntry = async (entry: Entry) => {
    if (!userId) return;

    try {
      const token = await getToken({ template: 'supabase' });
      if (!token) throw new Error('No authentication token');

      const client = createSupabaseClient(token);

      // Transform Entry to Supabase format
      // Don't include 'id' - let Supabase auto-generate UUID
      const supabaseEntry: any = {
        user_id: userId,
        date: entry.date,
        title: entry.title,
        caption: entry.caption,
        photos: entry.photos,
        mood: entry.mood,
        hashtags: entry.hashtags,
        song_url: entry.songUrl || null,
        voice_note: entry.voiceNote || null,
      };

      const { error } = await client
        .from('entries')
        .upsert(supabaseEntry, {
          onConflict: 'user_id,date',
        });

      if (error) throw error;

      // Reload entries to get the latest data
      await loadEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    }
  };

  const deleteEntry = async (id: string) => {
    if (!userId) return;

    try {
      const token = await getToken({ template: 'supabase' });
      if (!token) throw new Error('No authentication token');

      const client = createSupabaseClient(token);

      const { error } = await client
        .from('entries')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  const getEntryByDate = (date: string) => {
    return entries.find(e => e.date === date);
  };

  return { entries, loading, addEntry, deleteEntry, getEntryByDate };
};