# Aesthetic Calendar Memory 📅✨

A beautiful, aesthetic calendar application for capturing and preserving your daily memories with photos, music, and voice notes.

## Features

- 🎨 **Beautiful UI** - Aesthetic design with mood-based color themes
- 🔐 **Secure Authentication** - Powered by Clerk
- 💾 **Cloud Database** - Data stored securely in Supabase
- 📸 **Photo Collages** - Add up to 6 photos per day with drag-and-drop positioning
- 🎵 **Music Integration** - Auto-playing YouTube and Spotify embeds
- 🎤 **Voice Notes** - Record audio memories
- 📊 **Multiple Views** - Month and year views with highlights
- 🏷️ **Hashtags & Moods** - Organize and categorize your memories

## Prerequisites

- Node.js (v16 or higher)
- A [Clerk](https://clerk.com) account (free)
- A [Supabase](https://supabase.com) account (free)

## Setup Instructions

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Set Up Clerk Authentication

1. Go to [https://clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Choose your sign-in methods (Email, Google, etc.)
4. Copy your **Publishable Key** from the API Keys page

### 3. Set Up Supabase Database

1. Go to [https://supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be ready (1-2 minutes)
4. Go to **Settings** → **API** and copy:
   - **Project URL**
   - **anon public** key

### 4. Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"+ New query"**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **"Run"** to create the tables
5. Verify tables were created in **Table Editor**

### 5. Configure Environment Variables

1. Create a `.env.local` file in the project root (or use the existing one)
2. Add your credentials:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here

# Supabase Database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 6. Run the Application

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Deployment

This app can be deployed to:

- **Vercel** (Recommended)
  1. Push your code to GitHub
  2. Import the repository in Vercel
  3. Add environment variables in Vercel dashboard
  4. Deploy!

- **Netlify**
  1. Push your code to GitHub
  2. Import the repository in Netlify
  3. Add environment variables in Netlify dashboard
  4. Deploy!

**Important**: Make sure to add all environment variables (`VITE_CLERK_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in your deployment platform's settings.

## Usage

1. **Sign Up/Sign In** - Create an account using Clerk authentication
2. **Create Entries** - Click on any day to create a memory
3. **Add Photos** - Upload up to 6 photos and arrange them in a collage
4. **Add Music** - Paste a YouTube or Spotify link to attach a song
5. **Record Voice Notes** - Capture audio memories
6. **View Memories** - Click on days with entries to view them
7. **Highlights** - Use "Month Recap" or "Year Recap" to see all your memories

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Database Schema

The app uses two main tables:

- **users** - Stores user profiles (synced with Clerk)
- **entries** - Stores calendar entries with photos, music, voice notes, etc.

Row Level Security (RLS) is enabled to ensure users can only access their own data.

## Troubleshooting

### "Missing Clerk Publishable Key" error
- Make sure you've added `VITE_CLERK_PUBLISHABLE_KEY` to your `.env.local` file
- Restart the dev server after adding environment variables

### "Missing Supabase environment variables" error
- Make sure you've added both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your `.env.local` file
- Restart the dev server after adding environment variables

### Database errors
- Make sure you've run the `supabase/schema.sql` file in your Supabase SQL Editor
- Check that RLS policies are enabled in Supabase

### Music not auto-playing
- Some browsers block autoplay by default - users may need to interact with the page first
- YouTube videos with restricted embedding won't auto-play (use the fallback link)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ using React, Clerk, and Supabase
