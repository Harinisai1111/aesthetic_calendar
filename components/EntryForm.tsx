import React, { useState, useRef } from 'react';
import { X, Upload, Trash2, Move, Crop, Tag, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import { Entry, MoodType, Photo, VoiceNote } from '../types';
import { MOODS } from '../constants';
import { Collage } from './Collage';
import { VoiceRecorder } from './VoiceRecorder';
import { uploadFile } from '../services/storage';

interface EntryFormProps {
  date: string;
  userId: string;
  existingEntry?: Entry;
  onClose: () => void;
  onSave: (entry: Entry) => void;
  onDelete: (id: string) => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ date, userId, existingEntry, onClose, onSave, onDelete }) => {
  const { getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(existingEntry?.title || '');
  const [caption, setCaption] = useState(existingEntry?.caption || '');
  const [photos, setPhotos] = useState<Photo[]>(existingEntry?.photos || []);
  const [mood, setMood] = useState<MoodType>(existingEntry?.mood || 'happy');
  const [hashtags, setHashtags] = useState<string>(existingEntry?.hashtags.join(' ') || '');
  const [songUrl, setSongUrl] = useState(existingEntry?.songUrl || '');
  const [voiceNote, setVoiceNote] = useState<VoiceNote | undefined>(existingEntry?.voiceNote);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  // New state for edit mode
  const [cropMode, setCropMode] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploadingPhotos(true);
      try {
        const token = await getToken({ template: 'supabase' });
        if (!token) throw new Error('No auth token');

        const filesToUpload = Array.from(e.target.files).slice(0, 6 - photos.length);
        const uploadPromises = filesToUpload.map(async (file: File) => {
          const url = await uploadFile(file, 'photos', userId, token);
          return {
            id: Math.random().toString(36).substr(2, 9),
            url,
            rotation: Math.random() * 6 - 3,
            x: 0,
            y: 0,
            panX: 50,
            panY: 50
          };
        });

        const newPhotos = await Promise.all(uploadPromises);
        setPhotos([...photos, ...newPhotos]);
      } catch (error) {
        console.error('Error uploading photos:', error);
        alert('Failed to upload photos. Please try again.');
      } finally {
        setIsUploadingPhotos(false);
      }
    }
  };

  const handlePhotoUpdate = (updatedPhoto: Photo) => {
    setPhotos(prev => prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop form submission
    e.stopPropagation();

    if (existingEntry && window.confirm("Are you sure you want to delete this memory? This cannot be undone.")) {
      onDelete(existingEntry.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newEntry: Entry = {
      id: existingEntry?.id || Math.random().toString(36).substr(2, 9),
      userId,
      date,
      title: title || 'Untitled Memory',
      caption,
      photos,
      mood,
      hashtags: hashtags.split(' ').filter(t => t.startsWith('#')),
      songUrl,
      voiceNote,
      createdAt: Date.now()
    };

    onSave(newEntry);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-paper w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl relative z-10 flex flex-col md:flex-row font-sans"
      >
        {/* Left: Collage Preview (Interactive) */}
        {/* Added overflow-y-auto to fix button visibility on small screens or when collage is tall */}
        <div className="w-full md:w-1/2 bg-stone-100/50 border-r border-stone-200 relative flex flex-col overflow-y-auto custom-scrollbar">

          <div className="p-8 flex flex-col items-center flex-grow min-h-0">
            {/* Editor Controls */}
            <div className="w-full flex justify-between items-center mb-4">
              <div className="flex bg-white rounded-full shadow-sm p-1 border border-stone-200">
                <button
                  type="button"
                  onClick={() => setCropMode(false)}
                  className={`p-2 rounded-full transition ${!cropMode ? 'bg-stone-800 text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
                  title="Move Layout"
                >
                  <Move size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setCropMode(true)}
                  className={`p-2 rounded-full transition ${cropMode ? 'bg-stone-800 text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
                  title="Reposition Image (Crop)"
                >
                  <Crop size={16} />
                </button>
              </div>
              <p className="text-[10px] text-stone-400 italic">
                {cropMode ? "Drag photo to crop" : "Drag photo to move"}
              </p>
            </div>

            <div className="w-full aspect-[4/5] shadow-xl rotate-1 bg-white p-3 md:p-4 transition-all mb-4">
              <Collage
                photos={photos}
                className="w-full h-full"
                editable={true}
                cropMode={cropMode}
                onPhotoUpdate={handlePhotoUpdate}
              />
            </div>

            <div className="mt-2 flex flex-col items-center gap-3 w-full pb-8 md:pb-0">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={photos.length >= 6}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={photos.length >= 6}
                className="flex items-center gap-2 px-8 py-3 bg-stone-800 text-white rounded-full hover:bg-black transition shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed z-10"
              >
                <Upload size={18} />
                <span className="text-sm font-bold tracking-wide">Select Images from Computer</span>
              </button>

              {photos.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPhotos([])}
                  className="text-xs text-red-400 hover:text-red-600 underline px-2"
                >
                  Clear all photos
                </button>
              )}
              <p className="text-[10px] text-stone-400">{photos.length}/6 photos selected</p>
            </div>
          </div>
        </div>

        {/* Right: Form Details */}
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar bg-white/50">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-serif text-3xl text-stone-800">New Memory</h2>
              <p className="text-sm text-stone-500 mt-1">{new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-800"><X size={20} /></button>
          </div>

          <div className="space-y-5">
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Title your day..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full text-xl font-serif border-b border-stone-200 py-2 bg-transparent focus:outline-none focus:border-stone-400 placeholder-stone-300 transition-colors"
              />
            </div>

            {/* Mood Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3 block">Vibe Check</label>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(MOODS) as MoodType[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`w-10 h-10 rounded-full border-[3px] transition-all duration-300 flex items-center justify-center ${mood === m ? 'scale-110 border-stone-600 shadow-md' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: MOODS[m].bg }}
                    title={MOODS[m].label}
                  >
                    {mood === m && <div className="w-2 h-2 bg-stone-700 rounded-full" />}
                  </button>
                ))}
                <span className="ml-2 text-sm font-medium text-stone-500 self-center capitalize">{MOODS[mood].label}</span>
              </div>
            </div>

            {/* Caption */}
            <div>
              <textarea
                placeholder="How did you feel today? Capture the moment..."
                value={caption}
                onChange={e => setCaption(e.target.value)}
                rows={4}
                className="w-full p-4 bg-stone-50 rounded-xl text-sm text-stone-700 focus:outline-none resize-none border-2 border-transparent focus:bg-white focus:border-stone-200 transition"
              />
            </div>

            {/* Audio Section */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block">Soundscape</label>

              <VoiceRecorder existingNote={voiceNote} onSave={setVoiceNote} />

              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100 focus-within:border-stone-300 transition-colors">
                <Music size={18} className="text-stone-400" />
                <input
                  type="url"
                  placeholder="Paste Spotify or YouTube link..."
                  value={songUrl}
                  onChange={e => setSongUrl(e.target.value)}
                  className="flex-1 bg-transparent text-sm focus:outline-none text-stone-700 placeholder-stone-400"
                />
              </div>
            </div>

            {/* Hashtags */}
            <div className="flex items-center gap-2 border-b border-stone-100 py-2">
              <Tag size={16} className="text-stone-400" />
              <input
                type="text"
                placeholder="#memories #summer #vibes"
                value={hashtags}
                onChange={e => setHashtags(e.target.value)}
                className="flex-1 text-sm bg-transparent focus:outline-none text-stone-600 placeholder-stone-300"
              />
            </div>
          </div>

          <div className="mt-auto pt-6 flex justify-between items-center gap-3">
            {existingEntry && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition flex items-center gap-2 group"
                title="Delete Entry"
              >
                <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0">Delete</span>
              </button>
            )}
            <div className="flex gap-3 ml-auto">
              <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm text-stone-500 hover:text-stone-800 transition font-medium">Cancel</button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-stone-800 text-stone-50 text-sm font-bold tracking-wide rounded-full shadow-lg hover:bg-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                Save Memory
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};