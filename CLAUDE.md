# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a **Next.js 16 App Router** application with **Supabase** as the backend database. It is a Romanian-language doctor recommendation platform ("Moms4Moms — Recomandări Medici").

The old single-file HTML prototype is preserved in `archive/medici-ro.html` but is no longer the active codebase.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Database:** Supabase (PostgreSQL via `@supabase/supabase-js` + `@supabase/ssr`)
- **Styling:** Plain CSS in `src/app/globals.css` (no CSS framework)
- **Auth:** Supabase Auth (email/password) — used exclusively for the admin panel
- All pages fetch fresh from Supabase at request time (no static generation)

## Project Structure

```
src/
├── app/
│   ├── layout.js           — root layout: Nav, Footer, ToastProvider, FeedbackWidget
│   ├── page.js             — homepage: hero, stats, top 3 featured doctors
│   ├── globals.css         — all global styles
│   ├── loading.js          — root loading UI
│   ├── not-found.js        — 404 page
│   ├── medici/
│   │   ├── page.js         — doctor listing with filters, sort, pagination (24/page)
│   │   ├── loading.js
│   │   └── [id]/page.js    — doctor detail page
│   └── admin/
│       └── page.js         — admin panel (client component, requires Supabase Auth)
├── components/
│   ├── Nav.js              — top navigation bar
│   ├── Footer.js
│   ├── DoctorCard.js       — card used on listing and homepage
│   ├── HeroSearch.js       — search/city selector on homepage (client)
│   ├── FilterSidebar.js    — filters on /medici (client)
│   ├── SortSelect.js       — sort dropdown (client)
│   ├── DetailActions.js    — review/suggest buttons on detail page (client)
│   ├── AddDoctorModal.js   — modal to submit a new doctor (client)
│   ├── AddReviewModal.js   — modal to submit a review (client)
│   ├── SuggestModal.js     — modal to suggest edits (client)
│   ├── Stars.js            — star rating display
│   ├── Toast.js            — toast notification system (Context + hook)
│   └── FeedbackWidget.js   — floating site feedback widget (client)
└── lib/
    ├── constants.js        — SPECIALTIES list, AVATAR_COLORS
    ├── helpers.js          — avatarColor, initials, doctorFullName, avgRating, formatDate, uid
    └── supabase/
        ├── client.js       — browser Supabase client (singleton, null-safe for SSR)
        └── server.js       — server-side Supabase client (uses next/headers cookies)
```

## Database Tables (Supabase)

| Table | Key columns | Notes |
|---|---|---|
| `doctors` | `id`, `first_name`, `last_name`, `city`, `specs[]`, `clinics[]`, `obs`, `note`, `photo_url`, `status` | `status`: `'approved'` or `'pending'` |
| `reviews` | `id`, `doctor_id`, `rating`, `text`, `reviewer`, `date`, `status` | `status`: `'approved'` or `'pending'` |
| `suggestions` | `id`, `doctor_name`, `text`, `date` | Edit suggestions from users |
| `site_feedback` | `id`, `rating`, `text`, `date` | Star ratings + comments about the site |

## Routing

| Route | Description |
|---|---|
| `/` | Homepage — hero, stats, top 3 rated doctors |
| `/medici` | Full listing — filter by city/spec/rating/search, sort, paginate |
| `/medici/[id]` | Doctor detail — reviews, suggest edit, add review |
| `/admin` | Admin panel — requires Supabase Auth login |

URL search params on `/medici`: `q`, `city`, `spec`, `rating`, `sort`, `page`

## Admin Panel

- Located at `/admin` — fully client-side (`'use client'`, `force-dynamic`)
- Authentication via **Supabase Auth** (`supabase.auth.signInWithPassword`)
- Tabs: pending doctors, pending reviews, suggestions, site feedback, all doctors
- Admin can approve/reject/edit doctors and reviews directly via Supabase

## Development

```bash
npm run dev    # start dev server at http://localhost:3000
npm run build  # production build
npm start      # serve production build
```

Environment variables required (`.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

If these are missing or set to placeholder values, the Supabase client returns `null` and the app renders empty states gracefully.

## Language

All UI text is in Romanian. Keep new strings in Romanian when modifying the interface.
