# LUNÉVIA — Delhi's Premier Bridal Beauty Marketplace

LUNÉVIA connects Delhi brides with verified makeup artists, hairstylists, and bridal studios. Brides discover, plan, and book — artists manage their salon, bookings, and marketing — all powered by Supabase and Google Gemini AI.

**Live Demo:** [luneviaa.vercel.app](https://luneviaa.vercel.app)

---

## 🧭 What's Inside

- [For Brides — Page by Page](#-for-brides--page-by-page)
- [For Artists — Dashboard, Tab by Tab](#-for-artists--dashboard-tab-by-tab)
- [Tech Stack](#️-tech-stack)
- [Installation Guide](#-installation-guide)
- [File Structure](#-file-structure)
- [Design System](#-design-system)
- [Known Limitations & Roadmap](#️-known-limitations--roadmap)

---

## 👰 For Brides — Page by Page

### 🏠 Home (`/`)
- Smart search bar — type a query and it carries straight into Explore via `?q=`
- **Featured Artists** — top 4 salons, ranked live by rating (never hardcoded)
- Stats bar, "How It Works" walkthrough, and a banner pointing you to the AI Concierge

### 🔍 Explore (`/explore`)
- Filter by **specialty**, **locality**, and **price range**, or search by name
- Each salon card shows rating, specialties, price tier, and location
- 🔴 **Discount badge** — if a salon is running an active Growth Studio campaign, you'll see a red "% OFF" or "₹ OFF" badge on the card itself
- **Map** button on each card opens that salon's location directly in Google Maps — no need to open the full profile first

### 💄 Salon Detail Page (`/salon/[slug]`)
- Full profile: cover photo, bio, specialties, rating, and reviews
- **Navigate** button — opens the salon's exact saved location in Google Maps for turn-by-turn directions
- **Services menu** with price and duration for everything the artist offers
- **Portfolio gallery** — tap any photo to open a zoomable lightbox (pinch/click to zoom in or out)
- 🎁 **Active offer banner** — if the salon is running a campaign, you'll see the offer title, description, discount, and validity date right on the page, with its own "Book & Save" button
- **Reviews** — read what other brides said, or leave your own 5-star rating + comment if you're logged in

### 📅 Booking Flow (`/book/[slug]`)
A clean 3-step process:

1. **Select a Service** — pick from the salon's live service menu. If a discount campaign is active, you'll see the original price struck through next to the discounted price and a "% OFF" / "₹ OFF" tag — right on the service card
2. **Choose Time**
   - Pick a date from the calendar (past dates are disabled)
   - Pick an open time slot — already-booked slots are greyed out and marked "Taken"
   - 💡 **Stylist selection** — if the salon has multiple team members who can perform your chosen service, you'll be asked to pick which stylist you want *before* the slot is confirmed. A slot only shows as "Taken" once **every** capable stylist is already booked at that time — so even a busy slot might still be available with a different stylist
   - The **Order Summary** panel updates live with your service, date, time, stylist, and final (discounted, if applicable) price
3. **Confirmation** — your booking is saved instantly with a unique Booking ID, and you'll see your assigned stylist's name and direct phone number for coordination

Your name and phone number are auto-saved to your profile after your first booking, so you won't need to re-type them next time.

### 🤖 AI Tools
- **Concierge** (`/concierge` + floating widget on every page) — chat in English or Hindi; it recommends real, live artists from the database based on what you describe
- **Hairstyle Analyzer** (`/hairstyle`) — upload a face photo; analysis happens entirely in your browser (your photo is never uploaded), and Gemini suggests 3 bridal hairstyles suited to your face shape
- **Package Builder** (`/package-builder`) — answer 5 quick questions (wedding date, budget, services needed, aesthetic, skin tone) and get a custom bridal package recommendation with a matched top artist
- **Bridal Timeline** (`/timeline`) — enter your wedding date and get a month-by-month beauty prep schedule, auto-filled from your profile if you've already saved a wedding date

### 👤 Your Profile (`/profile`)
- **My Bookings** — upcoming bookings with status, stylist contact, and amount; a separate section for past/completed bookings
- **Budget Tracker** — total spend vs. remaining budget, calculated from your real bookings
- **Saved Salons** — anything you've hearted while browsing
- **Saved Packages** — AI-generated bridal packages you chose to keep
- Edit your name, wedding date, location, and budget anytime

---

## 💼 For Artists — Dashboard, Tab by Tab

Get started at `/artist/login` → complete the 4-step onboarding (salon basics, contact info, services, cover photo) → you'll land in your dashboard.

### 📊 Dashboard (Overview)
- Your salon's **Published / Draft** status at a glance
- Pending bookings count + this month's booking count
- A feed of your 5 most recent bookings
- If you're still in Draft, a banner reminds you to publish from the Profile tab

### 👤 Profile
- Edit name, description, locality, specialties, and contact details (phone, address, Instagram, WhatsApp, email)
- Paste a **Google Maps share link** here — this is what powers the "Navigate" button on your public salon page and the "Map" button on your Explore card
- **Publish / Unpublish toggle** — controls whether brides can find and book you at all

### 🧾 Services
- Add, edit, or delete services with name, category, duration, and price
- Changes go live on your public salon page and booking flow instantly — no separate "save and publish" step needed

### 🧑‍🤝‍🧑 Team
- Add your stylists, makeup artists, and assistants with name, role, and phone number
- Link each team member to the specific services they're capable of performing
- 💡 This directly powers stylist selection during a bride's booking — only team members linked to a service will be offered to brides booking that service, and their contact info is shared automatically once assigned

### 🖼️ Portfolio
- Upload photos straight from your device to your gallery
- Delete individual photos anytime — changes reflect immediately on your public page's Portfolio section

### 🗓️ Availability
- Set your working hours
- Block off specific dates you're unavailable (e.g. already booked privately, holidays)

### 📬 Bookings
- Filter by **All / Pending / Confirmed / Completed / Declined**
- New bookings appear in real time — no refresh needed
- **Confirm** a booking with one click, or **Decline** with a quick reason
- Bookings **auto-complete** once the appointment time + service duration has passed — you don't need to manually close them out
- Log partial or full **payment received** against each booking for your own tracking

### ⭐ Reviews
- Read-only feed of everything brides have said about you — name, star rating, comment, and date

### 📈 Growth Studio (Marketing)
Your campaign command center:
- **Create a campaign manually** — name, offer type (percentage or flat discount), applicable services, and a start/end date window
  - ⚠️ Combo Package and Free Add-on are visible as offer types but marked **"Coming Soon"** — they don't yet apply a real discount at checkout, so they're disabled for now
- **Generate a campaign with AI** — Gemini writes the campaign name, description, and ready-to-post Instagram/WhatsApp copy for you; the discount type and value are picked for you behind the scenes so every generated campaign is genuinely different, not a repeat of the last one
- Once a campaign is active, it automatically:
  - Shows a discount badge on your Explore card and Home featured listing
  - Shows a full offer banner on your salon page
  - Applies the discounted price throughout the booking flow and final checkout total
- **Track performance per campaign:**
  - **Views** — how many times your salon page loaded while the campaign was active
  - **Clicks** — how many times someone clicked "Book & Save" because of the offer
  - **Bookings** — how many of those clicks turned into an actual confirmed booking
  - **Conversion Rate** — Bookings ÷ Clicks, calculated automatically
- Edit, pause/activate, or delete any campaign anytime from the list

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| AI | Google Gemini API |
| Face Detection | MediaPipe Tasks Vision (client-side) |
| Deployment | Vercel |

---

## 🚀 Installation Guide

### Prerequisites
- Node.js v18+
- A Supabase project
- A Google Gemini API key

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/ranjanpritish16/LUNEVIA.git
cd LUNEVIA

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

```bash
# 4. Run required Supabase migrations (salons, bookings, reviews,
#    profiles, artist_campaigns) via the Supabase SQL Editor

# 5. Start the dev server
npm run dev
```

App runs at `http://localhost:3000`.

---

## 📁 File Structure

```
app/
├── page.tsx                        # Home
├── explore/                        # Browse salons
├── salon/[slug]/                   # Salon detail page
├── book/[slug]/                    # Booking flow
├── concierge/                      # AI Concierge (full page)
├── hairstyle/                      # AI Hairstyle Analyzer
├── package-builder/                # AI Package Builder
├── timeline/                       # AI Bridal Timeline
├── reviews/                        # Platform reviews
├── profile/                        # Customer dashboard
├── login/                          # Bride / Artist login
├── artist/
│   ├── login/
│   ├── onboarding/
│   └── dashboard/
│       ├── page.tsx                # Overview
│       ├── bookings/
│       ├── services/
│       ├── team/
│       ├── portfolio/
│       ├── profile/
│       ├── availability/
│       ├── reviews/
│       └── growth/                 # Growth Studio (campaigns)
├── api/ai/
│   ├── concierge/route.ts
│   ├── hairstyle/route.ts
│   ├── package/route.ts
│   ├── timeline/route.ts
│   └── campaign-generator/route.ts
├── about/, contact/, privacy/, terms/

components/
├── ai/ConciergeWidget.tsx
├── hairstyle/HairstyleAnalyzer.tsx
├── booking/BookingFlow.tsx
├── explore/ExplorePage.tsx
├── landing/
│   ├── HeroSection.tsx
│   ├── FeaturedArtistsSection.tsx
│   ├── HowItWorksSection.tsx
│   ├── StatsBar.tsx
│   ├── TestimonialsSection.tsx
│   └── ConciergeBanner.tsx
├── artist/
│   ├── DashboardShell.tsx
│   └── growth/
│       ├── GrowthOverview.tsx
│       ├── CampaignList.tsx
│       ├── CreateCampaignModal.tsx
│       └── AICampaignGenerator.tsx
├── layout/Navbar.tsx, Footer.tsx
└── ui/Badge.tsx, LuneviaButton.tsx, SalonCard.tsx, PromotionBadge.tsx

lib/
├── supabase.ts
├── gemini.ts
├── faceMesh.ts
├── hooks/
│   ├── useArtistSalon.ts
│   ├── useArtistCampaigns.ts
│   └── useCampaignAnalytics.ts
└── types/
    └── campaign.ts

```

---

## 🎨 Design System

| Token | Hex | Usage |
|---|---|---|
| PRIMARY | `#1A0A00` | Backgrounds, main text |
| GOLD | `#C9933A` | CTAs, highlights, borders |
| BLUSH | `#F5E8DC` | Cards, secondary backgrounds |
| ROSE | `#C4687A` | Tags, discount badges, hover states |
| CREAM | `#FAF6F0` | Page surfaces |
| CHARCOAL | `#2E1F1F` | Secondary text, icons |

**Fonts:** *Cormorant Garamond* (display) · *DM Sans* (body/UI)

---

## ⚠️ Known Limitations & Roadmap

**Limitations**
- Email/password auth only — Google & GitHub OAuth not yet implemented
- Combo Package and Free Add-on campaigns exist in the schema but have no pricing logic in checkout yet (UI-only, marked "Coming Soon")
- No booking rescheduling or trial-run scheduling yet

**Roadmap**
- Bundle/combo pricing support in checkout
- AI review summarizer on salon pages
- Mehendi style matcher
- Saved salons side-by-side comparison
- AI before/after makeup visualizer
- Admin dashboard for artist verification
- Push notifications (booking alerts)
- Multi-city expansion beyond Delhi

---

*LUNÉVIA — Built for AI Startup Buildathon 2026. "Your most beautiful day, designed by AI."*