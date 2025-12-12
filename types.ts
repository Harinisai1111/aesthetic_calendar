export type MoodType = 'happy' | 'calm' | 'nostalgic' | 'creative' | 'energetic' | 'reflective' | 'cozy';

export interface Photo {
  id: string;
  url: string;
  rotation: number; // For that "tossed on table" look
  x?: number; // Drag position X offset (Polaroid position)
  y?: number; // Drag position Y offset (Polaroid position)
  panX?: number; // Image Position X % (within the frame)
  panY?: number; // Image Position Y % (within the frame)
}

export interface VoiceNote {
  id: string;
  url: string;
  duration: number;
}

export interface Entry {
  id: string;
  userId: string; // Added for auth association
  date: string; // YYYY-MM-DD
  title: string;
  caption: string;
  photos: Photo[];
  voiceNote?: VoiceNote;
  songUrl?: string; // YouTube or Spotify link
  hashtags: string[];
  mood: MoodType;
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
}