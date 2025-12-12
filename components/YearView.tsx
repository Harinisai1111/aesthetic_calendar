import React from 'react';
import { motion } from 'framer-motion';
import { Entry, MoodType } from '../types';
import { MOODS } from '../constants';

interface YearViewProps {
  year: number;
  entries: Entry[];
  onMonthClick: (monthIndex: number) => void;
}

export const YearView: React.FC<YearViewProps> = ({ year, entries, onMonthClick }) => {
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full p-4">
      {months.map((date, monthIndex) => {
        const monthName = date.toLocaleString('default', { month: 'long' });
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const firstDay = new Date(year, monthIndex, 1).getDay(); // 0 = Sun

        // Filter entries for this month
        const monthEntries = entries.filter(e => {
          const d = new Date(e.date);
          return d.getFullYear() === year && d.getMonth() === monthIndex;
        });

        return (
          <motion.button
            key={monthName}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => onMonthClick(monthIndex)}
            className="bg-purple-50/40 p-4 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-all flex flex-col h-full"
          >
            <h3 className="text-lg font-serif font-bold text-stone-800 mb-2 border-b border-stone-100 pb-1 w-full text-left flex justify-between items-center">
              {monthName}
              {monthEntries.length > 0 && (
                <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-sans font-normal">
                  {monthEntries.length}
                </span>
              )}
            </h3>

            {/* Mini Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 w-full mt-auto">
              {/* Headers */}
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={i} className="text-[8px] text-stone-300 text-center font-bold">{d}</span>
              ))}

              {/* Blanks */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`b-${i}`} className="aspect-square" />
              ))}

              {/* Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const entry = monthEntries.find(e => e.date === dateStr);
                const moodColor = entry ? MOODS[entry.mood].bg : 'transparent';

                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-full flex items-center justify-center text-[9px] font-semibold ${entry ? 'text-white' : 'text-stone-700'}`}
                    style={{ backgroundColor: moodColor }}
                    title={entry?.title}
                  >
                    {/* Only show dots for entries to keep it clean, or tiny numbers if empty */}
                    {!entry && day}
                  </div>
                );
              })}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};