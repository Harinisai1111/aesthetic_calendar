import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Music, Download, Trash2, ExternalLink } from 'lucide-react';
import { MOODS as MOOD_CONSTANTS } from '../constants';
import { Entry as EntryType } from '../types';
import { Collage } from './Collage';
import { VoiceRecorder } from './VoiceRecorder';

interface DayDetailProps {
  entry: EntryType;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const DayDetail: React.FC<DayDetailProps> = ({ entry, onClose, onDelete }) => {
  const moodColor = MOOD_CONSTANTS[entry.mood];
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play Logic
  useEffect(() => {
    setIsPlaying(true);
  }, [entry.id]);

  const handleDownload = () => {
    alert("Exporting to PNG... (Feature would use html2canvas)");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this memory?")) {
      onDelete(entry.id);
    }
  }

  const renderEmbeddedPlayer = () => {
    if (!entry.songUrl) return null;

    // YouTube Logic
    // Fix for Error 153: simplified regex and removed strict parameters
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const ytMatch = entry.songUrl.match(ytRegex);

    if (ytMatch && ytMatch[1]) {
      const videoId = ytMatch[1];
      // Using standard embed URL with autoplay enabled
      // playsinline=1 helps on mobile, autoplay=1 starts playing automatically
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&mute=0`;

      return (
        <div className="flex flex-col gap-2">
          <div className="rounded-xl overflow-hidden shadow-lg h-32 md:h-48 bg-black">
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title="Song"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          {/* Fallback link in case embed fails (Error 153 restricted videos) */}
          <a
            href={entry.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-stone-400 hover:text-stone-600 flex items-center gap-1 self-end"
          >
            <ExternalLink size={10} /> Watch on YouTube directly
          </a>
        </div>
      );
    }

    // Spotify Logic
    if (entry.songUrl.includes('spotify.com')) {
      let embedUrl = entry.songUrl;
      if (!embedUrl.includes('/embed')) {
        embedUrl = embedUrl.replace('spotify.com', 'spotify.com/embed');
      }

      return (
        <div className="rounded-xl overflow-hidden shadow-lg h-24">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        layoutId={`day-${entry.date}`}
        className="relative z-10 w-full max-w-6xl h-full md:h-[90vh] bg-paper md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row font-sans"
      >
        {/* Close Button Mobile */}
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-white/50 backdrop-blur rounded-full md:hidden">
          <X size={20} />
        </button>

        {/* Visual Side (Left) */}
        <div className="w-full md:w-3/5 h-[40vh] md:h-full relative bg-stone-100 overflow-hidden">
          {/* Dynamic Background based on Mood */}
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: `linear-gradient(135deg, ${moodColor.bg} 0%, #ffffff 100%)` }}
          />

          <div className="absolute inset-0 p-8 md:p-12 flex items-center justify-center">
            <div className="w-full max-w-lg aspect-[4/5] shadow-2xl rotate-1 bg-white p-3 md:p-5 transition-transform duration-700 hover:rotate-0 hover:scale-105">
              <Collage photos={entry.photos} className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* Content Side (Right) */}
        <div className="w-full md:w-2/5 h-full bg-white flex flex-col relative z-20">
          {/* Decorative Mood Strip */}
          <div className="h-2 w-full" style={{ backgroundColor: moodColor.accent }} />

          <div className="p-8 md:p-10 flex-1 overflow-y-auto custom-scrollbar">

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-white shadow-sm" style={{ backgroundColor: moodColor.dark }}>
                  {moodColor.label}
                </span>
                <span className="text-xs font-bold tracking-widest uppercase text-stone-400">
                  {new Date(entry.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl text-stone-800 leading-[1.1] mb-4">
                {entry.title}
              </h1>

              <div className="flex gap-2 flex-wrap">
                {entry.hashtags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-stone-50 border border-stone-100 text-stone-500 text-xs font-medium rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div className="prose prose-stone prose-lg prose-p:text-stone-600 prose-p:leading-relaxed prose-p:font-serif mb-10">
              <p>{entry.caption}</p>
            </div>

            {/* Media Controls */}
            <div className="space-y-6 border-t border-stone-100 pt-8">
              {entry.voiceNote && (
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <p className="text-xs text-stone-400 mb-3 uppercase font-bold tracking-wider flex items-center gap-2">
                    <Music size={12} /> Voice Note
                  </p>
                  <VoiceRecorder existingNote={entry.voiceNote} onSave={() => { }} />
                </div>
              )}

              {entry.songUrl && (
                <div className="animate-fade-in-up">
                  <p className="text-xs text-stone-400 mb-2 uppercase font-bold tracking-wider">Now Playing</p>
                  {renderEmbeddedPlayer() || (
                    <div className="flex items-center gap-4 p-4 bg-stone-900 text-stone-50 rounded-xl shadow-lg">
                      <div className="p-3 bg-white/10 rounded-full animate-pulse">
                        <Music size={20} />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">Attached Song</p>
                        <a href={entry.songUrl} target="_blank" rel="noreferrer" className="text-sm font-medium truncate hover:underline block text-white">
                          Click to listen externally
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-stone-100 flex justify-between items-center bg-stone-50">
            <button onClick={onClose} className="hidden md:block p-3 text-stone-400 hover:text-stone-800 hover:bg-stone-200 rounded-full transition">
              <X size={24} />
            </button>

            <div className="flex gap-3 ml-auto">
              <button onClick={handleDelete} className="p-3 text-red-400 hover:text-red-700 bg-white border border-stone-200 rounded-full shadow-sm hover:shadow-md transition">
                <Trash2 size={18} />
              </button>
              <button onClick={handleDownload} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-200 text-stone-700 rounded-full text-sm font-bold hover:bg-stone-100 hover:shadow-md transition shadow-sm">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};