import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react';
import { VoiceNote } from '../types';

interface VoiceRecorderProps {
  existingNote?: VoiceNote;
  onSave: (note: VoiceNote | undefined) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ existingNote, onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingNote?.url || null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (existingNote) {
      setDuration(existingNote.duration);
    }
  }, [existingNote]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setDuration(recordingTime);
        onSave({ id: Date.now().toString(), url, duration: recordingTime });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please allow permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); // Stop mic indicator
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current && audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const deleteRecording = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setAudioUrl(null);
    setDuration(0);
    onSave(undefined);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
      {!audioUrl && !isRecording && (
        <button 
          onClick={startRecording}
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
        >
          <Mic size={18} />
          <span className="text-sm font-medium">Record Voice</span>
        </button>
      )}

      {isRecording && (
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 animate-pulse w-full"></div>
          </div>
          <span className="text-xs font-mono text-red-500 w-12">{formatTime(recordingTime)}</span>
          <button onClick={stopRecording} type="button" className="p-2 bg-stone-200 rounded-full hover:bg-stone-300">
            <Square size={16} className="text-stone-700" />
          </button>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="flex items-center gap-3 w-full">
          <button 
            onClick={togglePlayback}
            type="button"
            className="p-3 bg-stone-800 text-white rounded-full hover:bg-black transition-colors"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          
          {/* Faux Waveform */}
          <div className="flex-1 flex items-center gap-[2px] h-8">
             {Array.from({ length: 20 }).map((_, i) => (
               <div 
                  key={i} 
                  className={`w-1 rounded-full ${isPlaying ? 'animate-pulse bg-stone-800' : 'bg-stone-300'}`}
                  style={{ height: `${30 + Math.random() * 70}%`, animationDelay: `${i * 0.05}s` }}
               />
             ))}
          </div>

          <span className="text-xs font-mono text-stone-500">{formatTime(duration)}</span>

          <button onClick={deleteRecording} type="button" className="p-2 text-stone-400 hover:text-red-500 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};