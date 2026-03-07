# Dirty Deedz — Project Plan

## What This Is
A Next.js 16 web app for Dirty Deedz LLC — a sidewalk advertising platform using reverse graffiti (pressure-wash stencils). Three user flows: **Advertisers** lease sidewalk parcels, **Property Owners** list their sidewalk space, **Contractors** (licensed power washers) install and remove ads.

**Live URL:** https://dirtydeedz.com
**Repo:** https://github.com/DerekRemensnyder/dirty-deedz-landing
**Vercel Project:** `my-landing-page` (auto-deploys on push to `main`)
**Local:** `localhost:3000` — run `npm run dev` from `/dirty-deedz-next`

---

## Project Structure
```
dirty-deedz-next/
  app/
    page.tsx              ← Landing page (home)
    layout.tsx
    globals.css           ← All styles
    map/page.tsx          ← Map page
    join/page.tsx         ← Contractor onboarding (Phase 1)
    portal/page.tsx       ← Contractor dashboard (Phase 2)
    admin/page.tsx        ← Admin dashboard (Phase 3)
    api/
      checkout/           ← Stripe checkout API route
      contractors/        ← Contractor CRUD + verification (Phase 1)
      jobs/               ← Job matching + claim system (Phase 2)
      payments/           ← Stripe Connect transfers (Phase 2)
  components/
    Nav.tsx
    Hero.tsx
    HowItWorks.tsx
    Pricing.tsx
    MapFeature.tsx
    FAQ.tsx
    Testimonials.tsx
    About.tsx
    AdGuidelines.tsx
    CTA.tsx
    Footer.tsx
    ScrollTell.tsx
    map/
      MapView.tsx         ← Mapbox map + pins + popups + card view
      MapSidebar.tsx      ← Filters sidebar
      BookingPanel.tsx    ← Advertiser booking flow (Stripe)
      ListingPanel.tsx    ← Property owner 3-step listing flow
    join/                 ← Contractor onboarding components (Phase 1)
    portal/               ← Contractor dashboard components (Phase 2)
  data/
    map-pins.ts           ← All pin data (locations, status, pricing)
```

---

## Deployment Workflow
1. Make edits locally → test on `localhost:3000`
2. When happy → tell Claude to push
3. Vercel auto-deploys to `dirtydeedz.com` (~40 seconds)
4. **Never push broken code** — run `npm run build` locally to catch errors first

---

## Business Model — Unit Economics

### Revenue Per Deal
| | 2-mo ($800) | 4-mo ($1,400) | 6-mo ($2,000) |
|---|---|---|---|
| Advertiser pays | $800 | $1,400 | $2,000 |
| Stripe fee (~3%) | -$24 | -$42 | -$60 |
| Property owner (10%) | -$80 | -$140 | -$200 |
| Contractor (20%) | -$160 | -$280 | -$400 |
| Print + ship (~$40) | -$40 | -$40 | -$40 |
| **Dirty Deedz gross profit** | **$496 (62%)** | **$898 (64%)** | **$1,300 (65%)** |

- Design add-on: +$200 (stays with Dirty Deedz, minus design labor)
- Contractor starter kit (first job only): hat + shirt + shipped (~$40-60)

### Payment Flow — Single Charge, Stripe Connect Transfers
One Stripe charge (2.9% + 30¢) when advertiser pays. All payouts are Stripe Connect transfers (free for standard payouts).

| Trigger | Event | Money Moves |
|---|---|---|
| 1. Advertiser pays | Card charged, full amount in Dirty Deedz Stripe balance | $ in |
| 2. Artwork approved | If design service: Dirty Deedz designs → advertiser signs off. Print file sent to printer, printer paid. | Transfer to printer (~$40) |
| 3. Install complete | Contractor uploads before/after photos, verified | Transfer to contractor (half of 20%) |
| 4. Clean slate uploaded | Contractor uploads removal photos at term end | Transfer to contractor (other half of 20%) + Transfer to property owner (10%) |

---

## Contractor System — Licensed Service Providers

### Contractor Onboarding (automated, self-serve)
```
Step 1: Create Account → name, email, password, phone, company name, service area (zip codes)
Step 2: Watch Training Video → must complete before proceeding
Step 3: Upload Credentials → business license, COI ($1M CGL, Dirty Deedz as Additional Insured), govt ID
Step 4: Stripe Connect → Stripe-hosted onboarding (bank account, tax ID, identity)
Step 5: Accept Licensing Agreement → e-sign (non-compete, non-solicitation, brand usage terms)
Step 6: Account Active → all gates passed = can see and claim jobs in their zip codes
```

### Insurance Requirements
- **Required:** Commercial General Liability (CGL) — $1,000,000 minimum per occurrence, Dirty Deedz LLC named as Additional Insured
- **Required:** Workers' Compensation (if required by their state / if they have employees)
- **Recommended:** Commercial Auto Insurance
- **Verification:** Upload Certificate of Insurance (COI). System tracks expiration, auto-pauses account when expired.

### Contractor Scoring System
| Factor | Weight | Measured By |
|---|---|---|
| Install quality | Heavy | Rating after photo review (1-5 stars) |
| On-time completion | Heavy | Installed within 2-week window? Showed for removal on schedule? |
| Completed jobs | Medium | Total Deedz installed |
| Response time | Light | How fast they claim jobs |
| Photo quality | Light | Clear, well-lit, usable for social media |

### Score Tiers → Job Access
```
New (no score)        → 2-month jobs only, first 3 jobs are probation (you review)
Score 2.0+ (Active)   → 2-month jobs
Score 3.5+ (Proven)   → All jobs, eligible for 4-month+
Score 4.5+ (Elite)    → All jobs, priority on 6-month Takeover ($400 payout)
```

### Job Matching — Scored Claim System
1. New Deedz booked → all active contractors in matching zip codes notified
2. Claim window opens (24-48 hrs) → multiple contractors stake their claim
3. Window closes → system selects: score (primary) → proximity (secondary) → response time (tiebreaker)
4. Winner notified "You got the Deedz" → others notified "Not selected"
5. Contractor receives stencil via drop-ship with parcel address + orientation instructions

### Who Rates Contractors
- **Probation (first 3 jobs):** You review every install photo personally
- **Post-probation:** Property owner rates each install (1-5 stars via email prompt), you spot-check

### Legal Structure
- **Licensing agreement** (not franchise) — avoids FDD requirements, payroll taxes, employee classification
- Contractors are independent — bring own equipment, set own schedule, 2-week install window
- **Non-compete clause:** Cannot offer reverse graffiti / stencil advertising services to any Dirty Deedz client or in Dirty Deedz service areas for duration of agreement + 12 months
- **Non-solicitation clause:** Cannot directly solicit any advertiser or property owner sourced through Dirty Deedz
- **Brand usage:** Limited license to wear Dirty Deedz branded gear during installs only; no independent use of brand
- **Insurance requirement:** Shifts liability for property damage / injury to contractor's policy
- **Termination:** Either party with 30 days notice; immediate termination for fraud, safety violations, or brand misuse

---

## Build Phases

### Phase 1: Contractor Onboarding + Agreements ← CURRENT
**Goal:** A power washer can visit dirtydeedz.com/join, learn about the opportunity, and complete the full onboarding flow.

**1a. `/join` marketing page**
- Hero: "Become a Dirty Deedz Contractor" — earn $160-$400 per job
- How it works (3-4 steps visual)
- Earnings breakdown by tier
- Requirements (own equipment, insurance, business license)
- CTA: "Apply Now" → starts onboarding flow

**1b. Onboarding flow (5 steps)**
- Step 1: Account creation (name, email, phone, company, zip codes for service area)
- Step 2: Training video (embedded, must watch to completion)
- Step 3: Credential upload (business license, COI, government ID)
- Step 4: Stripe Connect onboarding (Stripe-hosted)
- Step 5: Licensing agreement review + e-sign

**1c. Licensing Agreement (legal document)**
- Full agreement text displayed in-app (like ListingPanel pattern)
- Covers: scope of license, non-compete, non-solicitation, insurance requirements, payment terms, termination, liability, dispute resolution
- E-signature (type full legal name)

**1d. Backend**
- Contractor data model (account, credentials, zip codes, score, status)
- API routes for contractor CRUD
- File upload handling for credentials
- Verification status tracking (pending → verified → active / rejected)

**Database decision needed:** We don't have a database yet. Options:
- Vercel Postgres (free tier, easy setup)
- Supabase (free tier, auth built in, file storage)
- PlanetScale (MySQL, generous free tier)

### Phase 2: Contractor Portal + Job System
- `/portal` dashboard (available jobs, claimed jobs, photo upload, payment history, score)
- Job matching engine (claim window, scored selection)
- Photo upload + verification flow
- Stripe Connect transfer triggers
- Notification system (email: job available, job assigned, payment sent)
- Property owner Stripe Connect onboarding (add to existing ListingPanel)

### Phase 3: Admin Dashboard
- `/admin` — view all orders, contractors, property owners
- Artwork approval flow (design → advertiser sign-off → trigger print)
- Job status tracking across all active Deedz
- Contractor score management / probation review
- Photo review interface
- Payment oversight
- COI expiration alerts

### Phase 4: Polish + Scale
- Mobile responsiveness pass (all new pages)
- Contractor mobile experience (they'll mostly use phones on-site)
- Automated COI verification (PINS or myCOI integration)
- Push notifications for job alerts
- Analytics dashboard (jobs completed, revenue, contractor performance)

---

## Completed Features ✅
- [x] Landing page with Hero, HowItWorks, Pricing, FAQ, Testimonials, CTA
- [x] Interactive Mapbox map with pins, popups, card view toggle
- [x] Map sidebar with filters (status, neighborhood, traffic, state/city)
- [x] BookingPanel — advertiser flow with lease terms, parcel selector, design options, Stripe checkout
- [x] ListingPanel — 3-step property owner flow (details → e-sign agreement → ownership verification)
- [x] Stripe checkout API route
- [x] GitHub → Vercel auto-deploy pipeline
- [x] Custom domain `dirtydeedz.com` live

---

## In Progress 🔄
- [ ] Phase 1: Contractor onboarding + licensing agreement

---

## Backlog (Pre-Expansion)
- [ ] "Lease a Deedz" sidebar button — needs click action
- [ ] Real listing form submission — needs backend
- [ ] Real booking confirmation — post-Stripe success page/email
- [ ] Mobile responsiveness pass
- [ ] Swap test Stripe keys for live keys

---

## Known Issues / Debt
- `dirty-deedz-next` Vercel project is connected to GitHub but broken (wrong root dir) — ignore it, use `my-landing-page` project
- `.env.local` contains secrets — never commit this file
- PostToolUse hook in Claude settings misfires on every edit (harmless)
- No database yet — need to choose and set up for Phase 1
- Testimonials component still has placeholder copy from template

---

## Environment Variables (in Vercel + .env.local)
| Key | Used For |
|-----|----------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Map tiles |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client |
| `STRIPE_SECRET_KEY` | Stripe server (checkout API) |
| `DATABASE_URL` | Database connection (Phase 1 — TBD) |

---

## Session Notes
- **2026-02-20** — Map page overhaul (BookingPanel, ListingPanel 3-step, sidebar cleanup, card view). Set up GitHub→Vercel auto-deploy pipeline. Fixed Mapbox token.
- **2026-02-26** — Planned contractor expansion model. Defined: licensing agreement structure, contractor scoring system, job matching (scored claim system), payment flow (single Stripe charge + Connect transfers), insurance requirements (CGL $1M + Additional Insured), unit economics (62-65% gross margin), 4-phase build plan. Starting Phase 1: contractor onboarding + agreements.

---
*Update this file at the end of every session. Start new sessions with: "Claude, continue with PLAN.md"*
