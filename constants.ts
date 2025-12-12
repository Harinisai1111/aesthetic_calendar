import { MoodType } from './types';

export const MOODS: Record<MoodType, { label: string; bg: string; accent: string; dark: string }> = {
  happy: { label: 'Happy', bg: '#FFD57E', accent: '#FFC145', dark: '#B38000' },
  calm: { label: 'Calm', bg: '#9AD3DE', accent: '#78C0CE', dark: '#2C6E7A' },
  nostalgic: { label: 'Nostalgic', bg: '#F7C7E7', accent: '#EAA2C6', dark: '#9D4C73' },
  creative: { label: 'Creative', bg: '#C1A3FF', accent: '#A380F7', dark: '#5E38C2' },
  energetic: { label: 'Energetic', bg: '#FFB3B3', accent: '#FF8080', dark: '#C23838' },
  reflective: { label: 'Reflective', bg: '#B8D8C0', accent: '#96C2A2', dark: '#4A7055' },
  cozy: { label: 'Cozy', bg: '#E6D3B8', accent: '#D4B895', dark: '#8F6F45' },
};

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, y: 50 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  }
};

// Initial Seed Data to make the app look good immediately
export const SEED_ENTRIES: any[] = [
  {
    id: 'seed-1',
    date: new Date().toISOString().split('T')[0],
    title: 'Coffee & Code',
    caption: 'Spent the entire afternoon working on this new aesthetic calendar project. The coffee was perfect, the vibes were immaculate.',
    photos: [
      { id: 'p1', url: 'https://picsum.photos/400/500?random=1', rotation: -2 },
      { id: 'p2', url: 'https://picsum.photos/400/400?random=2', rotation: 3 }
    ],
    hashtags: ['coding', 'coffee', 'vibes'],
    mood: 'creative',
    createdAt: Date.now()
  }
];