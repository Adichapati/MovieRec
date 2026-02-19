<!-- ╔══════════════════════════════════════════════════════════════╗ -->
<!-- ║  R E C O N  —  Movie Intelligence System                    ║ -->
<!-- ╚══════════════════════════════════════════════════════════════╝ -->

<div align="center">

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│     ██████╗ ███████╗ ██████╗ ██████╗ ███╗   ██╗     │
│     ██╔══██╗██╔════╝██╔════╝██╔═══██╗████╗  ██║     │
│     ██████╔╝█████╗  ██║     ██║   ██║██╔██╗ ██║     │
│     ██╔══██╗██╔══╝  ██║     ██║   ██║██║╚██╗██║     │
│     ██║  ██║███████╗╚██████╗╚██████╔╝██║ ╚████║     │
│     ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝     │
│                                                      │
│        MOVIE  INTELLIGENCE  SYSTEM  // v2.0          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**An adaptive movie recommendation engine with a retro-futuristic interface.**

*Modern machine. Retro soul.*

[![Next.js](https://img.shields.io/badge/NEXT.JS-16-c8a832?style=flat-square&logo=next.js&logoColor=c8a832)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TYPESCRIPT-5-c8a832?style=flat-square&logo=typescript&logoColor=c8a832)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/TAILWIND-v4-c8a832?style=flat-square&logo=tailwindcss&logoColor=c8a832)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/SUPABASE-DB-c8a832?style=flat-square&logo=supabase&logoColor=c8a832)](https://supabase.com)
[![TMDB](https://img.shields.io/badge/TMDB-API-c8a832?style=flat-square)](https://www.themoviedb.org)

</div>

---

## `> SYSTEM OVERVIEW`

Recon is a full-stack movie discovery platform built with **Next.js 16**, **React 19**, and **Supabase**. It features an adaptive recommendation engine that blends quiz-based preferences with real watch history — quiz influence decays as your viewing history grows.

The UI follows a **retro-futuristic terminal aesthetic**: monospace typography, muted amber accents on deep black, flat bordered layouts, scanline overlays, and Framer Motion animations (Ken Burns banner zoom, stagger-in cards, scroll-reveal sections).

---

## `> FEATURES`

```
┌─ CORE ──────────────────────────────────────────────┐
│                                                      │
│  > Browse popular & trending movies via TMDB API     │
│  > Full-text movie search with instant results       │
│  > Personal queue (watchlist) management             │
│  > Mark movies as watched → completed tracking       │
│  > Per-movie & homepage personalised recommendations │
│  > Adaptive engine — quiz decays, taste takes over   │
│  > Viewing insights (genre breakdown, weight bars)   │
│                                                      │
├─ AUTH ──────────────────────────────────────────────┤
│                                                      │
│  > Google OAuth or email/password sign-up            │
│  > NextAuth v5 session management                    │
│  > Protected routes with automatic redirects         │
│                                                      │
├─ UI / UX ───────────────────────────────────────────┤
│                                                      │
│  > Retro-futuristic dark theme (#0b0b0b + #c8a832)   │
│  > Monospace typography with terminal metaphors      │
│  > Framer Motion scroll-reveal & hover animations    │
│  > Ken Burns banner with crossfade + slow zoom       │
│  > Movie cards float up on hover ("file opening")    │
│  > Staggered grid entrance animations                │
│  > Scanline sweep & dot-grid background effects      │
│  > Fully responsive — mobile to ultrawide            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## `> ROUTE MAP`

```
/                          Landing page
/home                      Personalised feed — recommendations, popular, trending
/search                    Movie search
/movie/[id]                Movie details + similar recommendations
/watchlist                 Queue — movies saved to watch later
/completed                 Archive — movies you've finished
/profile                   User insights, stats, genre breakdown
/onboarding/preferences    Quiz-based preference setup
/login                     Authentication
/signup                    Account creation
```

---

## `> RECOMMENDATION ENGINE`

Recommendations blend three signals with **adaptive weighting**:

| Signal | Source |
|--------|--------|
| Quiz preferences | Genres, moods, era, pacing, popularity from onboarding |
| Watchlist activity | Genres & recency of saved movies |
| Completed movies | Strongest signal — actual viewing history |

### Adaptive Decay Formula

```
quizWeight      = max(0.30, 1 − completedCount / (completedCount + 10))
completedWeight = 1 − quizWeight
```

```
┌─────────────────┬─────────────┬──────────────────────┐
│ Completed Count │ Quiz Weight │ Watch History Weight  │
├─────────────────┼─────────────┼──────────────────────┤
│       0         │    100%     │         0%           │
│       5         │     67%     │        33%           │
│      10         │     50%     │        50%           │
│      20         │     33%     │        67%           │
│     50+         │  30% floor  │        70%           │
└─────────────────┴─────────────┴──────────────────────┘
```

Applied consistently across `/api/movies/recommend/[id]` and `/api/recommendations`.

---

## `> TECH STACK`

```
FRONTEND ─────── Next.js 16  ·  React 19  ·  TypeScript 5  ·  Tailwind CSS v4
ANIMATION ────── Framer Motion (scroll-reveal, Ken Burns, stagger, hover float)
AUTH ─────────── NextAuth.js v5 (beta) — Google OAuth + Credentials
DATABASE ─────── Supabase (PostgreSQL)
API ──────────── TMDB (movie data, images, metadata)
DEPLOYMENT ───── Vercel
```

---

## `> PROJECT STRUCTURE`

```
MovieRec/
├── Recon_v0/                        # Next.js app
│   ├── app/
│   │   ├── api/
│   │   │   ├── movies/              # TMDB proxy (search, trending, popular, recommend)
│   │   │   ├── recommendations/     # Homepage personalised recs
│   │   │   ├── watchlist/           # Queue CRUD + status management
│   │   │   ├── preferences/         # Quiz preferences
│   │   │   └── signup/              # Account creation
│   │   ├── home/                    # Authenticated homepage
│   │   ├── movie/[id]/              # Movie detail
│   │   ├── search/                  # Search
│   │   ├── watchlist/               # Queue page (status = "watchlist")
│   │   ├── completed/               # Archive page (status = "completed")
│   │   ├── profile/                 # Profile + Viewing Insights
│   │   ├── onboarding/              # Preference quiz
│   │   ├── login/                   # Login
│   │   └── signup/                  # Signup
│   ├── components/
│   │   ├── retro/                   # Retro UI primitives (TypeReveal, FocusFrame,
│   │   │                            #   ScanlineOverlay, ScrollReveal, RetroLoader,
│   │   │                            #   TerminalLine, BlinkingCursor)
│   │   ├── ui/                      # Shadcn/ui base components (retro-themed)
│   │   └── layouts/                 # Auth & main layouts
│   ├── lib/                         # Utilities (watchlist, genres, TMDB, Supabase)
│   └── hooks/                       # Custom hooks (useToast)
└── backend/                         # Flask backend (optional)
    └── app.py
```

---

## `> DATABASE SCHEMA`

```
┌─────────────────────┬──────────────────────────────────────────────────┐
│ Table               │ Key Columns                                      │
├─────────────────────┼──────────────────────────────────────────────────┤
│ users               │ id, email, name, image                           │
│ user_credentials    │ user_id, password_hash                           │
│ user_preferences    │ user_id, genres, moods, era, pacing, popularity  │
│ watchlist           │ user_id, movie_id, movie_title, poster_path,     │
│                     │ status ("watchlist" | "completed"), created_at    │
└─────────────────────┴──────────────────────────────────────────────────┘
```

### Migration

```sql
-- Add status column if upgrading from older version
ALTER TABLE watchlist ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'watchlist';
```

---

## `> API ENDPOINTS`

```
METHOD  ROUTE                          DESCRIPTION
─────── ────────────────────────────── ──────────────────────────────────────
GET     /api/movies/popular            Popular movies
GET     /api/movies/trending           Trending movies
GET     /api/movies/search?q=          Search movies
GET     /api/movies/[id]               Movie details
GET     /api/movies/recommend/[id]     Per-movie recs (adaptive scoring)
GET     /api/recommendations           Homepage personalised recs
GET     /api/watchlist                 User queue (supports ?status= filter)
POST    /api/watchlist                 Add to queue
PATCH   /api/watchlist                 Update status (watchlist ↔ completed)
DELETE  /api/watchlist                 Remove from queue
GET     /api/preferences               User quiz preferences
POST    /api/preferences               Save quiz preferences
POST    /api/signup                    Create account
```

---

## `> LOCAL DEVELOPMENT`

### Frontend (Next.js)

```bash
cd Recon_v0
npm install
npm run dev
# → http://localhost:3000
```

Create `.env.local` from `.env.example` and fill in the required values (see below).

### Backend (Flask — optional)

```bash
cd backend
python -m venv .venv
# Windows:  .venv\Scripts\activate
# macOS/Linux:  source .venv/bin/activate
pip install -r requirements.txt
python app.py
# → http://localhost:5000
```

Set `BACKEND_URL=http://localhost:5000` in `Recon_v0/.env.local` to use the Flask backend.

---

## `> ENVIRONMENT VARIABLES`

### `Recon_v0/.env.local`

```
TMDB_API_KEY              # TMDB API key (required for movie data)
GOOGLE_CLIENT_ID          # Google OAuth client ID
GOOGLE_CLIENT_SECRET      # Google OAuth client secret
NEXTAUTH_SECRET           # NextAuth.js secret key
NEXTAUTH_URL              # App URL (e.g. http://localhost:3000)
NEXT_PUBLIC_SUPABASE_URL  # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY # Supabase service role key (server-only)
BACKEND_URL               # Optional: Flask backend URL
```

---

## `> DESIGN SYSTEM`

```
PALETTE ──────── #0b0b0b background  ·  #c8a832 primary  ·  #d4d0c8 foreground
                 #111111 card  ·  #222222 border  ·  #1a1a1a muted
TYPOGRAPHY ───── Geist Sans + Geist Mono  ·  .font-retro utility
RADIUS ───────── 0.25rem (near-square)  ·  No rounded-full, no gradients
MOTION ───────── Framer Motion  ·  No steps() easing  ·  Respects prefers-reduced-motion
COMPONENTS ───── TypeReveal, FocusFrame, ScanlineOverlay, ScrollReveal,
                 RetroLoader, TerminalLine, BlinkingCursor
```

---

## `> TROUBLESHOOTING`

PowerShell execution policy blocking `npx`/`npm`:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Or run via cmd:
```bash
cmd /c npm run dev
```

---

<div align="center">

```
──────────────────────────────────────────
  © 2026 RECON — ALL RIGHTS RESERVED
  SESSION_END // STATUS: OK
──────────────────────────────────────────
```

</div>
