import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { Entry } from '../types';
import html2canvas from 'html2canvas';

interface HighlightsModalProps {
  title: string;
  entries: Entry[];
  onClose: () => void;
}

export const HighlightsModal: React.FC<HighlightsModalProps> = ({ title, entries, onClose }) => {
  const collageRef = useRef<HTMLDivElement>(null);

  // Filter entries that actually have photos
  const photoEntries = entries.filter(e => e.photos && e.photos.length > 0);
  
  // Limit to max 30 photos to prevent crashing, take 1 random from each entry
  const selectedPhotos = photoEntries.slice(0, 30).map(e => ({
    photo: e.photos[0],
    entryDate: e.date,
    rotation: (Math.random() * 10) - 5 // Random scatter rotation
  }));

  const handleDownload = async () => {
    if (collageRef.current) {
        const canvas = await html2canvas(collageRef.current, {
            scale: 2,
            backgroundColor: '#faf9f6'
        });
        const link = document.createElement('a');
        link.download = `Highlights-${title.replace(' ', '-')}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
         initial={{ opacity: 0 }} 
         animate={{ opacity: 1 }} 
         className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm"
         onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-paper w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
            <div>
                <h2 className="text-3xl font-serif font-bold text-stone-800">{title} Highlights</h2>
                <p className="text-stone-500 text-sm">{selectedPhotos.length} Memories captured</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-full text-sm font-medium hover:bg-black transition"
                >
                    <Download size={16} /> Save Image
                </button>
                <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-800">
                    <X size={24} />
                </button>
            </div>
        </div>

        {/* The Collage Area */}
        <div className="flex-1 overflow-y-auto bg-stone-100 p-8 flex items-center justify-center">
            {selectedPhotos.length === 0 ? (
                <div className="text-center text-stone-400 italic">
                    <p>No photos found in this period to create a highlight.</p>
                </div>
            ) : (
                <div 
                    ref={collageRef}
                    className="bg-paper p-8 shadow-2xl relative w-full aspect-[4/3] max-w-3xl mx-auto overflow-hidden flex flex-wrap content-center justify-center gap-4"
                    style={{ 
                        backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" 
                    }}
                >
                    {/* Artistic Title inside the image for export */}
                    <div className="absolute bottom-6 right-8 text-right z-50">
                        <h3 className="font-serif text-4xl text-stone-800 opacity-80 mix-blend-multiply">{title}</h3>
                        <p className="text-xs uppercase tracking-widest text-stone-500">Aesthetic Memory</p>
                    </div>

                    {/* Masonry/Scatter Layout */}
                    {selectedPhotos.map((item, i) => (
                        <div 
                            key={`${item.entryDate}-${i}`}
                            className="relative bg-white p-2 pb-6 shadow-md transition-transform"
                            style={{ 
                                transform: `rotate(${item.rotation}deg) scale(${0.8 + Math.random() * 0.4})`,
                                width: '140px',
                                flexGrow: Math.random() > 0.5 ? 1 : 0
                            }}
                        >
                            <img 
                                src={item.photo.url} 
                                className="w-full h-full object-cover aspect-square bg-stone-100" 
                                alt="memory"
                            />
                            <span className="absolute bottom-2 right-2 text-[8px] text-stone-400 font-serif">
                                {new Date(item.entryDate).toLocaleDateString(undefined, {day:'numeric', month:'short'})}
                            </span>
                        </div>
                    ))}
                    
                    {/* Noise Overlay */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply" 
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
                    />
                </div>
            )}
        </div>
      </motion.div>
    </div>
  );
};