import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, LogOut, Sparkles } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useEntries } from './services/store';
import { syncUserToSupabase } from './services/supabase';
import { MOODS as MOOD_CONSTANTS } from './constants';
import { Entry as EntryType } from './types';
import { EntryForm } from './components/EntryForm';
import { DayDetail } from './components/DayDetail';
import { LoginPage } from './components/LoginPage';
import { YearView } from './components/YearView';
import { HighlightsModal } from './components/HighlightsModal';

const App: React.FC = () => {
  // Clerk Authentication
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  // We need getToken to sync the user securely
  const { getToken } = useClerk().session || { getToken: async () => null };

  // Sync user to Supabase when authenticated
  useEffect(() => {
    const sync = async () => {
      if (isSignedIn && user) {
        // Fetch the Supabase token
        // Important: User needs to set this up in Clerk Dashboard!
        try {
          const token = await getToken({ template: 'supabase' });
          if (token) {
            await syncUserToSupabase(user, token);
          } else {
            console.warn("No Supabase token available. Did you set up the JWT template in Clerk?");
          }
        } catch (e) {
          console.error("Failed to sync user:", e);
        }
      }
    };

    sync();
  }, [isSignedIn, user, getToken]);

  // Main Store Instance - Single Source of Truth
  const { entries, addEntry, deleteEntry, getEntryByDate } = useEntries();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewingEntry, setViewingEntry] = useState<EntryType | null>(null);

  // New View States
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [highlightConfig, setHighlightConfig] = useState<{ title: string; entries: EntryType[] } | null>(null);

  // Auth Handler
  const handleLogout = () => {
    signOut();
  };

  // Calendar Logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, currentDate.getMonth() - 1));
    } else {
      setCurrentDate(new Date(year - 1, 0));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, currentDate.getMonth() + 1));
    } else {
      setCurrentDate(new Date(year + 1, 0));
    }
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = getEntryByDate(dateStr);

    if (entry) {
      setViewingEntry(entry);
    } else {
      setSelectedDate(dateStr);
      setIsEditing(true);
    }
  };

  const handleSaveEntry = async (entry: EntryType) => {
    await addEntry(entry);
    setIsEditing(false);
    setSelectedDate(null);
  };

  const handleDeleteEntry = async (id: string) => {
    await deleteEntry(id);
    setIsEditing(false);
    setViewingEntry(null);
    setSelectedDate(null);
  };

  // Highlight Logic
  const openMonthHighlights = () => {
    const monthEntries = entries.filter(e => e.date.startsWith(`${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`));
    setHighlightConfig({
      title: `${monthName} ${year}`,
      entries: monthEntries
    });
  };

  const openYearHighlights = () => {
    const yearEntries = entries.filter(e => e.date.startsWith(`${year}-`));
    setHighlightConfig({
      title: `${year} Recap`,
      entries: yearEntries
    });
  };

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-texture flex items-center justify-center">
        <div className="text-stone-500 text-lg font-serif">Loading...</div>
      </div>
    );
  }

  // Show login page if not signed in
  if (!isSignedIn) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-texture flex flex-col items-center py-6 px-4 font-sans transition-colors duration-500">

      <header className="w-full max-w-6xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-800">Aesthetic Memory</h1>
          <p className="text-stone-500 text-sm mt-1 font-medium tracking-wide">
            Welcome, {user?.firstName || user?.fullName || 'there'}
          </p>
        </div>
        <div className="flex items-center gap-3 self-end">
          {/* View Toggles */}
          <div className="bg-white p-1 rounded-full border border-stone-200 flex shadow-sm">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'month' ? 'bg-stone-800 text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('year')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'year' ? 'bg-stone-800 text-white shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
            >
              Year
            </button>
          </div>

          <button onClick={handleLogout} className="p-2.5 text-stone-400 hover:text-stone-800 hover:bg-stone-200 rounded-full transition">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl bg-paper rounded-[2rem] shadow-xl shadow-stone-400/20 overflow-hidden border border-white/50 relative min-h-[600px] flex flex-col">

        {/* Decorative top grain */}
        <div className="h-2 w-full bg-gradient-to-r from-stone-200/50 via-stone-100/50 to-stone-200/50" />

        {/* Navigation & Actions */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-stone-100/50">
          <div className="flex items-center gap-6">
            <h2 className="text-4xl font-serif text-stone-800 flex items-baseline gap-3">
              {viewMode === 'month' ? monthName : ''} <span className="text-3xl text-stone-400 font-sans">{year}</span>
            </h2>
            <div className="flex gap-1 bg-stone-100 rounded-full p-1">
              <button onClick={handlePrev} className="p-2 hover:bg-white rounded-full text-stone-600 transition shadow-sm"><ChevronLeft size={16} /></button>
              <button onClick={handleNext} className="p-2 hover:bg-white rounded-full text-stone-600 transition shadow-sm"><ChevronRight size={16} /></button>
            </div>
          </div>

          {/* Highlights Button */}
          <button
            onClick={viewMode === 'month' ? openMonthHighlights : openYearHighlights}
            className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-200 text-stone-600 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-stone-800 hover:text-stone-50 hover:border-stone-800 transition-all shadow-sm"
          >
            <Sparkles size={14} className="group-hover:animate-spin" />
            {viewMode === 'month' ? 'Month Recap' : 'Year Recap'}
          </button>
        </div>

        <div className="flex-1 bg-stone-50/50">
          {viewMode === 'month' ? (
            <>
              {/* Days Header */}
              <div className="grid grid-cols-7 px-8 py-4 border-b border-stone-100">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-[10px] font-bold uppercase tracking-widest text-stone-500 text-center">{d}</div>
                ))}
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-7 auto-rows-[minmax(120px,1fr)] bg-stone-300 gap-[1px]">
                {blanks.map(i => <div key={`blank-${i}`} className="bg-purple-50/20" />)}

                {days.map(day => {
                  const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const entry = getEntryByDate(dateStr);
                  const mood = entry ? MOOD_CONSTANTS[entry.mood] : null;

                  return (
                    <motion.div
                      key={day}
                      whileHover={{ backgroundColor: '#ffffff' }}
                      onClick={() => handleDayClick(day)}
                      className="bg-purple-50/30 p-3 relative group cursor-pointer transition-colors overflow-hidden flex flex-col justify-between"
                    >
                      <span className={`text-sm font-semibold z-10 relative ${entry ? 'text-stone-800 font-bold' : 'text-stone-700'} group-hover:text-stone-900`}>
                        {day}
                      </span>

                      {entry ? (
                        <>
                          <div
                            className="absolute inset-1 top-8 rounded-xl opacity-20 transition-opacity group-hover:opacity-30 mix-blend-multiply"
                            style={{ backgroundColor: mood?.bg }}
                          />
                          <div className="absolute top-3 right-3 w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: mood?.accent }} />

                          <div className="relative z-10 mt-auto">
                            {entry.photos.length > 0 && (
                              <div className="relative w-full aspect-[4/3] mb-2 rotate-2 shadow-sm transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105 group-hover:shadow-md">
                                <img src={entry.photos[0].url} className="w-full h-full object-cover rounded-sm border-2 border-white" alt="" />
                              </div>
                            )}
                            <p className="text-[10px] font-serif font-medium text-stone-600 truncate leading-tight tracking-wide">{entry.title}</p>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                          <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 shadow-sm">
                            <Plus size={18} />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </>
          ) : (
            <YearView
              year={year}
              entries={entries}
              onMonthClick={(monthIndex) => {
                setCurrentDate(new Date(year, monthIndex, 1));
                setViewMode('month');
              }}
            />
          )}
        </div>
      </main>
      {/* SEO Content Section (for Google) */}
      <section className="max-w-3xl mx-auto mt-24 mb-16 px-4 text-center text-stone-600">
        <h2 className="text-2xl font-serif mb-4 text-stone-700">
          Aesthetic Calendar Journal
        </h2>
        <p className="leading-relaxed">
          A digital calendar journal designed to capture daily memories with photos,
          music, moods, captions, and voice notes — all organized beautifully by date.
          This aesthetic memory calendar helps you relive moments in a calm,
          visually pleasing way.
        </p>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {isEditing && selectedDate && user?.id && (
          <EntryForm
            date={selectedDate}
            userId={user.id}
            existingEntry={getEntryByDate(selectedDate)}
            onClose={() => setIsEditing(false)}
            onSave={handleSaveEntry}
            onDelete={handleDeleteEntry}
          />
        )}
        {viewingEntry && (
          <DayDetail
            entry={viewingEntry}
            onClose={() => setViewingEntry(null)}
            onDelete={() => handleDeleteEntry(viewingEntry.id)}
          />
        )}
        {highlightConfig && (
          <HighlightsModal
            title={highlightConfig.title}
            entries={highlightConfig.entries}
            onClose={() => setHighlightConfig(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;