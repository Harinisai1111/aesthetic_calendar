# Aesthetic Calendar Memory 📅✨

A **calendar-based digital journaling web app** that lets users capture daily memories with photos, music, moods, captions, and voice notes — all organized beautifully by date.

🔗 **Live Demo**: [https://aestheticcalendar-tau.vercel.app](https://aestheticcalendar-tau.vercel.app)

---

## 🌸 Why Aesthetic Calendar Memory?

Traditional journaling apps focus on text.
**Aesthetic Calendar Memory** focuses on *emotion, visuals, and time*.

It transforms a calendar into a personal memory space where each date becomes a story — blending design, media, and reflection.

---

## ✨ Features

* 🎨 **Aesthetic UI** — Minimal, calming design with mood-based color accents
* 🔐 **Authentication** — Secure login & signup using Clerk
* 💾 **Cloud Storage** — User data stored securely with Supabase (PostgreSQL)
* 📸 **Photo Collages** — Upload up to 6 photos per day with visual layouts
* 🎵 **Music Embeds** — Attach YouTube / Spotify links to memories
* 🎤 **Voice Notes** — Record and store audio memories
* 📆 **Calendar Views** — Month and Year views with interactive navigation
* ✨ **Highlights** — Monthly & yearly memory recaps
* 🏷️ **Moods & Tags** — Organize memories emotionally

---

## 🧠 Tech Stack

* **Frontend**: React + TypeScript + Vite
* **Styling**: Tailwind CSS
* **Authentication**: Clerk
* **Database**: Supabase (PostgreSQL + RLS)
* **Animations**: Framer Motion
* **Icons**: Lucide React
* **Deployment**: Vercel

---

## 📊 Analytics & SEO

* Google Analytics (GA4) integrated
* Google Search Console verified
* Sitemap submitted for faster indexing
* SEO-optimized metadata & content

---

## 🚀 Getting Started (Local Setup)

### Prerequisites

* Node.js v16+
* Clerk account (free)
* Supabase account (free)

---

### 1️⃣ Install Dependencies

```bash
npm install
```

---

### 2️⃣ Set Up Clerk

1. Create a project at [https://clerk.com](https://clerk.com)
2. Enable sign-in methods (Email / Google)
3. Copy your **Publishable Key**

---

### 3️⃣ Set Up Supabase

1. Create a project at [https://supabase.com](https://supabase.com)
2. Go to **Settings → API**
3. Copy:

   * Project URL
   * anon public key

---

### 4️⃣ Create Database Tables

1. Open **Supabase → SQL Editor**
2. Run the schema from:

```bash
supabase/schema.sql
```

3. Ensure Row Level Security (RLS) is enabled

---

### 5️⃣ Configure Environment Variables

Create a `.env.local` file:

```env
# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx

# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
```

---

### 6️⃣ Run Locally

```bash
npm run dev
```

App runs at:

```
http://localhost:5173
```

---

## 🏗️ Build for Production

```bash
npm run build
```

Production files will be generated in the `dist/` folder.

---

## 🌍 Deployment

### Vercel (Recommended)

1. Push project to GitHub
2. Import repo into Vercel
3. Add environment variables
4. Deploy 🚀

### Netlify

1. Push project to GitHub
2. Import repo into Netlify
3. Add environment variables
4. Deploy

⚠️ **Important**:
Environment variables must be added in the hosting dashboard.

---

## 🧪 Usage Guide

1. Sign up / log in
2. Click a date to create a memory
3. Add photos, music, voice notes & mood
4. Revisit memories via calendar or highlights
5. Explore monthly & yearly recaps

---

## 🗄️ Database Overview

### Tables

* **users** — synced from Clerk
* **entries** — calendar-based memory entries

🔒 Row Level Security ensures users can access **only their own data**.

---

## 🛠️ Troubleshooting

### Clerk key missing

* Check `VITE_CLERK_PUBLISHABLE_KEY`
* Restart dev server

### Supabase errors

* Verify keys
* Ensure schema is applied
* Check RLS policies

### Media autoplay issues

* Browser autoplay restrictions apply
* User interaction may be required

---

## 📌 Future Enhancements

* Custom domain support
* Public shareable memories
* Export memories as images or PDFs
* AI-generated memory summaries

---

## 📄 License

MIT License

---

## 💙 Support

If you find this project useful or have suggestions:

* Open an issue
* Star the repo ⭐

---

**Built with care using React, Clerk & Supabase**
