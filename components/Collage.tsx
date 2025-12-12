import React from 'react';
import { motion } from 'framer-motion';
import { Photo } from '../types';
import { Move, Crop } from 'lucide-react';

interface CollageProps {
  photos: Photo[];
  className?: string;
  preview?: boolean;
  editable?: boolean;
  cropMode?: boolean; // New prop: true = pan image, false = move polaroid
  onPhotoUpdate?: (photo: Photo) => void;
}

export const Collage: React.FC<CollageProps> = ({ 
  photos, 
  className = '', 
  preview = false, 
  editable = false,
  cropMode = false,
  onPhotoUpdate 
}) => {
  const count = photos.length;

  if (count === 0) return <div className="w-full h-full bg-stone-100 rounded-lg flex items-center justify-center text-stone-400 italic font-serif">Add a photo to start</div>;

  const handleDragEnd = (photo: Photo, info: any) => {
    if (onPhotoUpdate) {
      if (cropMode) {
        // Update Pan (Percentage based roughly on drag distance relative to 100px arbitrary unit)
        // We clamp it between 0 and 100 for object-position %
        const currentPanX = photo.panX ?? 50;
        const currentPanY = photo.panY ?? 50;
        
        // Sensitivity factor
        const deltaX = info.offset.x * 0.5; 
        const deltaY = info.offset.y * 0.5;

        onPhotoUpdate({
          ...photo,
          panX: Math.min(100, Math.max(0, currentPanX - deltaX)), // Invert drag for "panning" feel
          panY: Math.min(100, Math.max(0, currentPanY - deltaY))
        });
      } else {
        // Update Layout Position
        onPhotoUpdate({
          ...photo,
          x: (photo.x || 0) + info.offset.x,
          y: (photo.y || 0) + info.offset.y
        });
      }
    }
  };

  const renderPolaroid = (photo: Photo, extraClass: string = '') => (
    <Polaroid 
      key={photo.id}
      photo={photo} 
      className={extraClass} 
      drag={editable} // Enable drag if editable
      cropMode={cropMode}
      onDragEnd={editable ? (e, info) => handleDragEnd(photo, info) : undefined}
    />
  );

  // Aesthetic layouts based on count
  const renderLayout = () => {
    switch (count) {
      case 1:
        return (
          <div className="w-full h-full p-6 flex items-center justify-center">
            {renderPolaroid(photos[0], "w-full h-full max-w-[90%] max-h-[90%]")}
          </div>
        );
      case 2:
        return (
          <div className="relative w-full h-full">
            <div className="absolute top-4 left-4 w-2/3 h-2/3 z-10">
               {renderPolaroid(photos[0], "w-full h-full")}
            </div>
            <div className="absolute bottom-4 right-4 w-2/3 h-2/3 z-20">
               {renderPolaroid(photos[1], "w-full h-full")}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full p-4">
            <div className="row-span-2 h-full">{renderPolaroid(photos[0], "w-full h-full")}</div>
            <div>{renderPolaroid(photos[1], "w-full h-full")}</div>
            <div>{renderPolaroid(photos[2], "w-full h-full")}</div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full p-4">
            {photos.map(p => (
              <div key={p.id} className="w-full h-full">
                {renderPolaroid(p, "w-full h-full")}
              </div>
            ))}
          </div>
        );
      default: // 5 or 6
        return (
          <div className="grid grid-cols-3 grid-rows-2 gap-2 w-full h-full p-2">
            <div className="col-span-2 row-span-2 h-full">{renderPolaroid(photos[0], "w-full h-full")}</div>
            {photos.slice(1).map(p => (
              <div key={p.id} className="w-full h-full col-span-1 row-span-1">
                {renderPolaroid(p, "w-full h-full")}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />
        <div className="relative z-10 w-full h-full">
          {renderLayout()}
        </div>
    </div>
  );
};

interface PolaroidProps {
  photo: Photo;
  className?: string;
  drag?: boolean;
  cropMode?: boolean;
  onDragEnd?: (event: any, info: any) => void;
}

const Polaroid: React.FC<PolaroidProps> = ({ photo, className = '', drag, cropMode, onDragEnd }) => {
  return (
    <motion.div 
      drag={drag}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      // If cropMode is true, we lock position (x,y) visually to prevent confusing double-movement during drag
      // But we still fire onDragEnd to update the pan logic. 
      // To simulate "panning", we just consume the drag event without moving this div if cropMode is on.
      dragConstraints={cropMode ? { left: 0, right: 0, top: 0, bottom: 0 } : undefined}
      dragElastic={cropMode ? 0 : 0.5} 

      style={{ x: photo.x || 0, y: photo.y || 0 }}
      whileDrag={{ scale: cropMode ? 1 : 1.1, zIndex: 100, rotate: 0, cursor: cropMode ? 'move' : 'grabbing' }}
      whileHover={{ scale: 1.02, zIndex: 50, cursor: drag ? (cropMode ? 'move' : 'grab') : 'default' }}
      initial={{ rotate: photo.rotation }}
      className={`bg-white p-2 pb-8 shadow-lg shadow-stone-400/20 ${className} relative group`}
    >
      <div className="w-full h-full overflow-hidden bg-stone-100 relative pointer-events-none">
        <img 
            src={photo.url} 
            alt="memory" 
            className="w-full h-full object-cover absolute inset-0 select-none" 
            loading="lazy" 
            style={{
                objectPosition: `${photo.panX ?? 50}% ${photo.panY ?? 50}%`
            }}
        />
      </div>
      
      {/* Visual Indicator of Mode on Hover */}
      {drag && (
        <div className="absolute top-2 right-2 bg-stone-800/10 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            {cropMode ? <Crop size={12} className="text-stone-800" /> : <Move size={12} className="text-stone-800" />}
        </div>
      )}
    </motion.div>
  );
};