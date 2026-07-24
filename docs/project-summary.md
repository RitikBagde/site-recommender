# WhereWatch — Project Summary

## Overview

WhereWatch is a responsive discovery directory for media platforms — streaming services, anime sites, manga readers, live sports broadcasters, and media apps — aggregated into a searchable, filterable directory. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4.

---

## What Has Been Implemented

### Core Directory
- **Data Layer** — Fetches listings from Supabase with automatic fallback to local JSON. Graceful degradation if the database is unreachable.
- **Category + Region Filtering** — Users can filter platforms by category and region. Filters sync to URL search params (shareable/bookmarkable).
- **Fuzzy Search** — Client-side scoring across name, description, domain, category, payment model, and region.
- **Bookmarking / Pinning** — Persistent via localStorage. Pinned items sort to top of listings.

### UI & Experience
- **Desktop Sidebar** — Sticky navigation console with an animated category pill tracker, region dropdown, search input, and live category counts.
- **Mobile UI** — Responsive header with search + category scroll, and a bottom-sheet quick-jump navigator.
- **Directory Grid** — Responsive layout (2–7 columns). Sections listings by category when viewing "All", with animated transitions via Framer Motion.
- **Platform Cards** — 3D tilt-on-hover, pin/unpin, external link, copy-link, payment badge, region indicator.
- **Logo System** — Platform logos loaded from category-based folders, with text fallback on missing assets.
- **Hero Banner** — Animated video hero with call-to-action.
- **Stat Banner** — Animated counter (platforms, categories, regions).
- **Loading Skeletons** — Shimmer states for grids and cards.
- **Animations** — 3D card tilt, animated number pop-in, skeleton reveals, modal transitions, error shake.

### Feedback System
- **Suggest a Platform** — Form to submit platform name, URL, category, notes.
- **Report a Link** — Form to report broken links, wrong region, outdated info, or other issues.
- **API Route** — Validates and inserts submissions into Supabase, with local-only fallback.

### Platform Data
- **~120 platform listings** across all categories — major services (Netflix, Prime, Disney+, Crunchyroll, etc.) and free/ad-supported alternatives.
- **10 regions** — US/UK, India, Germany, France, Japan, South Korea, Spain, Italy, Poland, Egypt.
- **72 platform logos** organized into category folders.

---

## Category System — Filtering Rules

### The 7 Categories

| ID | Label | Description |
|---|---|---|
| `movies` | Movies & Shows | On-demand films, series, cinematic bundles |
| `tv-shows` | TV Shows | Episodic series, premium streaming collections |
| `anime` | Anime | Anime streaming and aggregators |
| `manga` | Manga | Manga libraries, readers, chapter drops |
| `live-sports` | Live TV & Sports | Live broadcasts, sports channels, event streams |
| `apps` | Apps | Media apps, viewers, organization tools |
| `paid` | Paid | Subscription-only services, premium access |

### Category Filtering Rule (Strict)

A single deterministic rule governs where every listing appears:

1. **If `paymentModel === "subscription"`** → the listing appears **only** in the `paid` category. It is **strictly excluded** from all native content categories (movies, tv-shows, anime, manga, live-sports, apps).

2. **If `paymentModel` is `"free"`, `"ad-supported"`, or `"rental"`** → the listing appears in its native content category. It never appears in `paid`.

3. **"All" view** → every listing is shown, but subscription items are grouped under the "Paid" section header.

This ensures free and ad-supported resources are never mixed with premium subscription links, keeping each browsing surface focused.

### Payment Models

| Model | Behaviour |
|---|---|
| `free` | Appears in native category |
| `ad-supported` | Appears in native category |
| `rental` | Appears in native category |
| `subscription` | Appears only in `paid` category |

### Region Aliasing

Filtering supports region aliases for broader matching:

- `US` → matches `US`, `UK`, `GB`
- `DE` → matches `DE`, `EU`
- `FR` → matches `FR`, `EU`
- `ES` → matches `ES`, `EU`
- `IT` → matches `IT`, `EU`
- `PL` → matches `PL`, `EU`
- Other regions match only their own code.

---

## Architecture Notes

- **Entry point**: `src/app/page.tsx`
- **Data source config**: `src/config/listing.datasource.json`
- **Core filtering logic**: `src/lib/listings.ts`
- **Type definitions**: `src/types/index.ts`
- **UI orchestrator**: `src/components/shared/DiscoveryWorkspace.tsx`
