# Dirty Deedz — Claude Code Instructions

## Project Overview
Reverse-graffiti advertising marketplace. Advertisers lease sidewalk/storefront ad spots; contractors power-wash stencil ads; property owners earn passive revenue.

- **Live site:** https://dirtydeedz.com
- **Repo:** https://github.com/DerekRemensnyder/dirty-deedz-landing
- **Vercel project:** `my-landing-page` (NOT `dirty-deedz-next` — that project is broken)
- **App root:** `/Users/vera/my-landing-page/dirty-deedz-next/`

## Stack
- Next.js 16, React 19, TypeScript
- Mapbox GL JS (style: `mapbox://styles/mapbox/dark-v11`)
- Stripe (checkout)
- Supabase (DB + file storage)
- Resend (transactional email)

## Workflow
- Edits go to **local files only** — never push unless user says "push it"
- Always run `npm run build` before pushing — catches TypeScript errors
- Vercel auto-deploys on push to `main` (~40s)
- PostToolUse hook misfires on every file edit — **always harmless, always ignore it**

## Key File Map

| What | Where |
|------|-------|
| All CSS/styles | `app/globals.css` |
| Map pin data | `data/map-pins.ts` |
| Landing page sections | `components/*.tsx` |
| Map app | `app/map/page.tsx` + `components/map/` |
| Booking flow | `components/map/BookingPanel.tsx` |
| Saved cart tray | `components/map/SavedTray.tsx` |
| Contractor signup | `app/join/` + `components/join/` |
| Property owner signup | `app/list/` |
| Stripe checkout API | `app/api/checkout/route.ts` |
| Email helpers | `lib/email.ts` (lazy-init Resend — do NOT move `new Resend()` to module level) |
| Supabase client | `lib/supabase.ts` |

## Design Tokens
```
Brand yellow:   #d5ff45
Brand teal:     #00d29a
Brand magenta:  #df3257
Dark bg:        #0a0a0a / #111114 / #191a1e (Mapbox)
Card bg:        #1e2026
Border:         rgba(255,255,255,.08)
```

## Map Pin Types (data/map-pins.ts)
- **Available** (yellow `#d5ff45`) — 1 parcel, bookable
- **Multiple Deedz** (teal `#00d29a`) — 2+ parcels, bookable
- **Coming Soon** (magenta `#df3257`) — not yet bookable

25 total pins: 13 teal, 6 yellow, 6 red.

## Lease Terms (LEASE_TERMS array)
| Name | Months | Rate/mo | Total | Savings |
|------|--------|---------|-------|---------|
| THE STREET CRED | 2 | $400 | $800 | — |
| THE HUSTLE | 4 | $350 | $1,400 | $200 |
| THE TAKEOVER | 6 | $333 | $2,000 | $400 |

## MapFeature Phone Frames (components/MapFeature.tsx)
Scroll-storytelling section with 5 sticky phone frames (0–4):
- **Frame 0** — Intro map overview (all pins)
- **Frame 1** — Live Availability: Browse Deedz panel, animated filter cycle (filterStep 0→1→2), pulsing map orbs
- **Frame 2** — Lock In Your Terms: booking panel with term pills
- **Frame 3** — Your Ad Brief: ad copy fields + upload
- **Frame 4** — Review & Checkout: yellow bg, punchlist, Stripe CTA

`filterStep` state cycles 0→1→2 on 2s interval while frame 1 is active. Phone entry animation: `.phone-pre-enter` → `.phone-entered` class swap.

## CSS Conventions
- Single global stylesheet: `app/globals.css` — no CSS modules, no Tailwind
- Chip pattern: `.chip` / `.chip.active { border-color: #d5ff45; color: #d5ff45; }`
- Booking panel: `.booking-panel` (dark) / `.booking-panel--multi` (yellow `#d5ff45` bg)
- Term pills: `.term-pill` / `.term-pill.active`
- Section labels: `.section-label` (uppercase, letter-spaced, brand-colored)
- Phone animation: `@keyframes mfPhoneEnter`, `@keyframes mfPulse` (pulse rings on map markers)

## Known Gotchas
- **Resend client** must be lazy-initialized (`const getResend = () => new Resend(...)`) — module-level init crashes Vercel build when `RESEND_API_KEY` env var is absent
- **Vercel env vars needed for full function:** `RESEND_API_KEY`, `REVIEWER_EMAILS`, `REVIEW_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_MAPBOX_TOKEN`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- **ScrollTell** (`components/ScrollTell.tsx`) — cards stack absolutely on top of each other, revealed one at a time via `.active` class on scroll. Do NOT change to flex-row.
- **MapFeature** uses `getBoundingClientRect()` center detection, not IntersectionObserver
