# LUNÉVIA
## AI Startup Buildathon 2026 — Complete Execution Bible
### "Your most beautiful day, designed by AI."

---

> **Hackathon:** AI Startup Buildathon 2026 – Beauty Salon Marketplace Challenge
> **Organizer:** SuperXgen AI Builder Series
> **Build Phase:** 16 June – 21 June 2026
> **Submission Deadline:** 22 June 2026
> **Results:** 28 June 2026

---

## ✅ COMPLETED FEATURES (LATEST UPDATES)
- **Interactive 5-Star Ratings**: Implemented dynamic selection UI across platform reviews and salon reviews.
- **Auto-completion Bookings**: Artist dashboard automatically updates bookings to 'completed' once the precise service duration passes the appointment start time.
- **Google Maps Navigation**: Integrated Map links stored by artists and accessible by customers via one-click 'Navigate' buttons on cards and hero banners.
- **Smart Auth Redirect**: First-time users are automatically redirected to complete their profile setup rather than returning to the homepage.
- **Reviewer Identity**: Reviews elegantly display the author's full name instead of raw email addresses for a more premium look.
- **TypeScript Strict Safety**: All Supabase typing and array iteration build errors resolved for flawless Vercel production deployments.

---

## PART 0: THE DECISION — Delhi vs. Bangalore

**Choose: Delhi Bridal Beauty Booking Platform.**

Here's why it wins on every axis:

**Visual Impact**: Bridal aesthetics are inherently more emotionally resonant — gold, florals, celebration, transformation. A luxury bridal platform can be *gorgeous* in a way a generic "salon finder" cannot. Judges will feel it in the first 10 seconds.

**Narrative Power**: There's a story — a bride, a big day, the pressure of looking perfect. That story writes your demo script for you. "Bangalore Luxury Salon Finder" has no story arc. Delhi Bridal does.

**AI Integration**: Bridal context unlocks far richer AI features — AI bridal look matching, AI mehendi style recommender, AI package builder, AI skin tone analysis. These feel *magical* and contextual. A salon finder's AI is just "smarter search."

**Market Specificity**: Delhi = wedding capital of India. Judges immediately understand the market size, emotional stakes, and why this should exist. It feels like a real YC startup pitch, not a class project.

**Innovation Ceiling**: Bridal is a premium, high-intent, high-anxiety vertical. That means users pay more, trust matters more, and AI that *reduces anxiety* is more impressive than AI that just filters salons.

**Commit: Delhi Bridal Beauty Booking Platform.**

---

## PART 1: STARTUP BRANDING

### Name: LUNÉVIA

A coined luxury name — warm, European-inflected, modern. It sounds like it belongs next to Glossier, Veil, or Curology. Fully trademarkable. Clean as a domain. Judges who don't know Indian languages can still feel its premium quality. Judges who do won't associate it with anything generic.

### Tagline Options
- **"Your most beautiful day, designed by AI"** *(aspirational, product-forward — recommended)*
- **"Every bride deserves a LUNÉVIA"** *(emotional, inclusive)*
- **"Where Delhi's brides are made"** *(local authority, confidence)*

**Recommended: "Your most beautiful day, designed by AI"** — it encapsulates both the emotional promise and the tech differentiator.

### Brand Personality
Think: a luxury boutique that went to IIT and got Y Combinator funding. Not a government portal. Not a beauty blog. A startup that respects your intelligence, knows your culture, and uses technology as a service to beauty — not the other way around.

Adjectives: **warm, intelligent, ceremonial, intimate, precise**.

Avoid: cold tech vibes, generic SaaS blues, over-designed clutter.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| PRIMARY | `#1A0A00` | Deep ceremonial black — backgrounds, text |
| GOLD | `#C9933A` | Heritage gold — CTAs, highlights, borders |
| BLUSH | `#F5E8DC` | Warm ivory — secondary backgrounds, cards |
| ROSE | `#C4687A` | Muted rose — secondary accent, tags, hover |
| CREAM | `#FAF6F0` | Off-white — main surface |
| CHARCOAL | `#2E1F1F` | Dark warm brown — secondary text, icons |

**The logic**: This palette reads as a luxury Indian wedding brand — not garish, not generic. Gold-on-deep-black has the same emotional weight as a royal wedding invitation. The cream and blush keep it light and breathable for web UI. Rose adds femininity without being cliché pink.

### Typography
- **Display / Hero**: *Cormorant Garamond* — tall, elegant serifs evoking luxury print. Use for headlines, hero text, and the LUNÉVIA wordmark.
- **Body / UI**: *DM Sans* — clean, modern, highly legible. Pairs with Cormorant without competing.
- **Accent / Numbers**: *Playfair Display* (italic) — for prices, package names, special callouts.

### Design Language: "Ceremonial Modernism"
Clean, whitespace-generous layouts (modern) with ceremonial texture details — subtle gold borders, floral SVG accents in corners, paper-like cream surfaces. Think a luxury wedding invitation reimagined as a web app. Every screen should feel like it could be printed on fine paper.

### UI Mood
- Mobile-first card layouts with generous padding
- Soft shadows: `box-shadow: 0 4px 24px rgba(201, 147, 58, 0.08)`
- Gold hairline borders: `0.5px–1px, #C9933A at 20% opacity`
- Subtle grain texture on hero backgrounds
- Smooth, slow animations: 400–600ms ease-in-out — not bouncy, not instant

### Brand Story
> "In India, a bride spends ₹1–5 lakh on her bridal look — yet the booking experience is fragmented across WhatsApp groups, Instagram DMs, and word-of-mouth. LUNÉVIA brings the entire bridal beauty journey into one intelligent platform: AI-matched stylists, curated packages, verified portfolios, and a personal LUNÉVIA Concierge that helps every bride find her perfect look. We're starting with Delhi — the wedding capital of India — and building the platform that brides deserve."

### Landing Page Messaging Hierarchy
1. **Hook**: "Your most beautiful day, designed by AI."
2. **Sub-hook**: "Delhi's most trusted bridal beauty platform"
3. **Social proof**: "2,400+ verified artists · 15,000+ weddings"
4. **CTA**: "Meet LUNÉVIA Concierge" / "Browse Salons"

---

## PART 2: COMPLETE FEATURE LIST

### 🔴 MUST HAVE (MVP — ship by Day 4 of build phase)

**Core Discovery**
- Browse salons/artists with cards (name, rating, specialty, price range, verified badge)
- Salon detail page (portfolio gallery, services, pricing, team, reviews)
- Search with instant results (Algolia-style filtering on mock data)
- Filter by: specialty (bridal makeup, mehendi, hair, pre-bridal), location, price range, rating
- Category pages: Bridal Makeup · Mehendi Artists · Hair Stylists · Pre-Bridal Packages

**Booking Flow**
- Date + time slot selection (calendar UI)
- Package selection from salon's menu
- Booking confirmation screen with summary
- Shareable booking confirmation card

**LUNÉVIA Concierge (the star feature)**
- Floating AI chat widget — "Describe your look, get matched"
- Text-based consultation: user types preferences → AI returns 3 salon recommendations with reasoning
- Skin tone + occasion input form feeding AI recommendations

**Landing Page**
- Hero: tagline, search bar, "Meet LUNÉVIA Concierge" CTA
- Featured salons carousel
- How it works (3 steps)
- Social proof section
- Footer

**Authentication**
- Email/phone sign in via Supabase Auth
- Profile page: name, wedding date, saved salons

---

### 🟡 SHOULD HAVE (polish layer — Days 5–6 of build phase)

**AI Hairstyle Recommender**
- Upload face photo → AI returns hairstyle recommendations for face shape
- Powered by Gemini Vision API
- Results shown as curated gallery with stylist matches

**Smart Package Builder**
- 5-question wizard (date, budget, services, style, skin type)
- AI generates custom package recommendation across multiple vendors
- "Package Card" export — screenshot-ready layout

**Review System**
- Star ratings + text reviews on salon pages
- AI-generated review summary via LUNÉVIA Concierge
- Verified booking badge on reviews

**Saved / Wishlist**
- Heart icon → saves to profile
- "My Wishlist" page with 2-salon comparison feature

**Mehendi Style Matcher**
- Gallery: Rajasthani · Arabic · Indo-Western · Minimalist
- AI quiz → recommends style + matching artists

---

### 🟢 OPTIONAL WOW FEATURES (pure judge impressiveness)

**AI Before/After Visualizer** *(highest wow, hardest to build)*
- Upload selfie → AI "applies" a makeup look preview
- Use Replicate API (SDXL or similar) for style transfer

**Live Availability Calendar** *(medium effort, high polish)*
- Real-time-looking calendar on each salon page
- Skeleton loading states, smooth transitions

**Bridal Timeline AI Feature** *(medium effort, unique idea)*
- User inputs wedding date → AI generates month-by-month beauty prep schedule
- Output: beautiful shareable timeline card

**Vernacular LUNÉVIA Concierge** *(low effort, high cultural signal)*
- Concierge responds in Hindi when user types in Hindi
- Add to system prompt: "Respond in the same language the user writes in"

**Animated Onboarding** *(medium effort, very high first impression)*
- 3-step wizard with Framer Motion transitions
- Collects: wedding date, budget, location, look preferences
- Immediately feeds LUNÉVIA Concierge recommendations

---

## PART 3: AI INTEGRATION PLAN

### Feature 1: LUNÉVIA Concierge (The Centerpiece)

**How it works**: Floating chat interface (bottom-right, every page). User describes requirements — "I have a dusky complexion, traditional Delhi wedding, budget ₹25,000, want a dewy bridal look." AI returns 3 matched salons from your database with personalized reasoning.

**System prompt**:
```
You are LUNÉVIA Concierge, a luxury bridal beauty consultant for Delhi weddings.
You have access to a curated database of salons and artists. Based on the bride's
requirements, recommend 3 salons with specific reasoning. Format your response as
JSON with: salonId, matchScore, reasoning, specialNote.
Always be warm, confident, and specific. Never be generic.
```

**Implementation**:
- Use `gpt-4o-mini` (fast, cheap) or `gemini-1.5-flash`
- Pass salon data as JSON in the context
- Parse JSON response → render as beautiful salon cards
- Build time: 4–6 hours | Wow factor: 9/10 | Difficulty: Medium

---

### Feature 2: AI Hairstyle Face-Shape Analysis

**How it works**: User uploads selfie → Gemini Vision analyzes face shape → returns top 3 hairstyle categories + stylists on the platform.

```javascript
// Gemini Vision call
const response = await fetch('https://generativelanguage.googleapis.com/v1/...')
// Returns: { faceShape, recommendations: [{style, description, whyItWorks}] }
```

- Build time: 3–4 hours | Wow factor: 10/10 | Difficulty: Medium-Low
- **Demo moment**: Upload a photo live during the video. The real-time AI response will impress every judge.

---

### Feature 3: AI Package Builder

**How it works**: 5-question wizard → AI generates a fully custom bridal package with timing advice and cost breakdown.

**Output (structured JSON)**:
```json
{
  "packageName": "The Dewy Bride",
  "services": [...],
  "timeline": [...],
  "totalEstimate": "₹28,000–₹32,000",
  "recommendedArtists": [...]
}
```

- Build time: 3 hours | Wow factor: 8/10 | Difficulty: Low

---

### Feature 4: AI Review Summarizer

**How it works**: Each salon page shows a LUNÉVIA Concierge-generated summary of what customers consistently praise.

Example output: *"85 brides loved her work — customers consistently praise her ability to enhance natural features without overdoing it. Bridal trials are highly recommended."*

- Pass all reviews to `gpt-4o-mini` → prompt for a 2-sentence warm summary → cache result
- Build time: 1–2 hours | Wow factor: 7/10 | Difficulty: Very Low

---

### Feature 5: AI Bridal Timeline Generator

**How it works**: User enters wedding date → AI generates a personalized month-by-month beauty prep schedule → rendered as a beautiful shareable timeline card.

- Build time: 2 hours | Wow factor: 8/10 | Difficulty: Very Low

---

### Feature 6: AI Smart Search

**How it works**: Instead of keyword matching, the search bar understands intent. "Someone who does subtle makeup for outdoor weddings" returns relevant results.

- On search: send query to OpenAI → parse into tags → filter salon database
- Build time: 2 hours | Wow factor: 7/10 | Difficulty: Low

---

## PART 4: FULL TECHNICAL ARCHITECTURE

### Tech Stack

```
Frontend:     Next.js 14 (App Router) + TypeScript
Styling:      Tailwind CSS v3 + custom CSS variables for brand colors
Components:   shadcn/ui (base) + custom luxury components
Animation:    Framer Motion
Backend:      Next.js API Routes
Database:     Supabase (PostgreSQL + Auth + Storage)
AI:           OpenAI API (gpt-4o-mini) + Google Gemini API (vision)
Images:       Supabase Storage + Next.js Image optimization
Deployment:   Vercel
Domain:       lunevia.in OR lunevia.vercel.app
```

### Folder Structure

```
/lunevia
├── app/
│   ├── page.tsx                      (Landing page)
│   ├── explore/page.tsx              (Browse all salons)
│   ├── salon/[id]/page.tsx           (Salon detail page)
│   ├── book/[salonId]/page.tsx       (Booking flow)
│   ├── concierge/page.tsx            (LUNÉVIA Concierge full page)
│   ├── hairstyle/page.tsx            (AI Hairstyle Analyzer)
│   ├── package-builder/page.tsx      (AI Package Builder)
│   ├── profile/page.tsx              (User profile + saved)
│   └── api/
│       ├── ai/concierge/route.ts     (LUNÉVIA Concierge endpoint)
│       ├── ai/hairstyle/route.ts     (Gemini Vision endpoint)
│       ├── ai/package/route.ts       (Package builder endpoint)
│       └── ai/timeline/route.ts      (Timeline generator endpoint)
├── components/
│   ├── ui/                           (shadcn base components)
│   ├── salon/                        (SalonCard, SalonGallery, etc.)
│   ├── ai/                           (ConciergeWidget, HairstyleAnalyzer, etc.)
│   ├── booking/                      (CalendarPicker, PackageSelector)
│   └── layout/                       (Navbar, Footer, PageWrapper)
├── lib/
│   ├── supabase.ts
│   ├── openai.ts
│   ├── gemini.ts
│   └── data/                         (Mock salon data — JSON files)
└── styles/
    └── globals.css                   (CSS variables for LUNÉVIA brand system)
```

### Database Schema (Supabase)

**salons**
```sql
id, name, slug, description, location, specialty[],
price_range, rating, review_count, verified,
cover_image, gallery_images[], services (JSONB),
team (JSONB), contact, created_at
```

**bookings**
```sql
id, user_id, salon_id, service_id, date, time_slot,
status, total_amount, notes, created_at
```

**reviews**
```sql
id, salon_id, user_id, rating, text, verified_booking,
ai_summary_included (bool), created_at
```

**profiles** (extends Supabase auth.users)
```sql
id, full_name, wedding_date, budget_range,
location, saved_salons[], onboarding_complete
```

> **Shortcut**: Start with mock JSON data for 10–15 salons. Add Supabase only for auth and bookings. Saves 2–3 days.

### Authentication

```typescript
// Magic Link — 1 line of code, feels modern
const { error } = await supabase.auth.signInWithOtp({ email })
```

### API Rule
Never put AI API keys in the frontend. All AI calls go through `/api/ai/` routes.

---

## PART 5: UI/UX BLUEPRINT

### Page List (priority order)
1. Landing Page
2. Explore / Browse
3. Salon Detail Page
4. LUNÉVIA Concierge Page
5. Booking Flow (3 steps)
6. AI Hairstyle Analyzer
7. Package Builder
8. Profile / Dashboard

---

### Landing Page Architecture

**Hero Section**
```
[ornamental divider — gold SVG]
"Your most beautiful day,"
[gradient text: gold → rose] "designed by AI"
[subtitle] "Delhi's most trusted bridal beauty platform"
[search bar — pill shape, gold border]
[CTAs] "Meet LUNÉVIA Concierge" (gold fill) | "Browse Salons" (ghost)
```

**Section 2 — Social Proof Numbers**
```
2,400+ Verified Artists | 15,000+ Weddings | ₹2.1Cr+ Bookings Facilitated
```

**Section 3 — How It Works**
```
1. Tell LUNÉVIA Concierge your vision
2. Get matched to verified artists
3. Book your perfect bridal look
```

**Section 4** — Featured Salons Carousel (4 visible cards, horizontal scroll)

**Section 5** — AI Feature Spotlight (split layout: Concierge chat screenshot + description)

**Section 6** — Testimonials (3 cards: photo, name, wedding date, review, stars)

**Section 7** — Footer (dark background, LUNÉVIA logo + tagline, nav columns)
```
"Made with ❤️ for Delhi's brides" — LUNÉVIA
```

---

### Salon Card Design

```
[Cover photo — 3:2 ratio, rounded corners]
[Verified badge — gold, top-right of image]
[Specialty tags — pill badges in rose/blush]
[Name — Cormorant Garamond, 20px]
[Rating — star + number + review count]
[Price range — ₹₹ or ₹₹₹]
[CTA — "View Profile" ghost button]
```

Hover: `translateY(-4px)`, deeper shadow, slightly brighter cover photo.

---

### Salon Detail Page

**Above fold**: Full-width cover image with gradient overlay. Floating info card (name, verified, rating). Sticky "Book Now" button on scroll.

**Below fold tabs**:
- Overview
- Portfolio (masonry photo grid)
- Services & Pricing (accordion)
- Reviews (paginated + LUNÉVIA Concierge AI summary at top)
- Location (Google Maps iframe)

---

### Animation System (Framer Motion throughout)

| Interaction | Animation |
|-------------|-----------|
| Page transition | fade + y: 20→0, 400ms |
| Card list | staggered, 80ms between cards |
| Scroll reveal | `whileInView`, fade up |
| Heart save | scale 1→1.3→1 bounce |
| CTA hover | scale 1→1.02 |
| CTA press | scale 1→0.98 |
| Loading | shimmer skeleton screens |

---

### Mobile-First Rules
- Single-column mobile, 2–3 column desktop
- Floating "Book Now" bar fixed at bottom on mobile (Airbnb-style)
- LUNÉVIA Concierge is a bottom sheet on mobile
- All tap targets minimum 44px height
- Swipeable carousels: `overflow-x: auto` + scroll snap

---

## PART 6: DEMO VIDEO STRATEGY

### 2-Minute Script

**0:00–0:10 — Hook**
Slow-motion shot of LUNÉVIA hero page. Voice over: *"Every year, 10 million Indian weddings happen. And every bride deserves to look exactly the way she imagined."*

**0:10–0:25 — The Problem**
Show: Instagram DM chaos, WhatsApp screenshots, generic justdial results.
Voice: *"The current experience is broken. Fragmented. Stressful."*

**0:25–0:55 — LUNÉVIA Introduction**
Land on lunevia.vercel.app. Hero section loads. Voice: *"This is LUNÉVIA."* 2-sentence explanation. "Let me show you how it works."

**0:55–1:25 — LUNÉVIA Concierge Demo (The Money Shot)**
Type live: *"I'm having a traditional Delhi wedding, wheatish complexion, budget ₹30,000 for bridal makeup, I want a look that enhances my natural features. Wedding is in 3 months."*
Let the AI respond in real-time. Don't talk over it. Let judges see it thinking.

**1:25–1:45 — Browse + Booking Flow**
Salon cards → salon detail → portfolio → pick service → calendar → confirmation. Show the animations. Keep moving.

**1:45–1:55 — Hairstyle AI Feature**
Upload a photo. Get face shape analysis + recommendations. 10 seconds. Visually stunning.

**1:55–2:00 — Close**
Return to hero. Logo. Voice: *"LUNÉVIA — your most beautiful day, designed by AI."*
`lunevia.vercel.app` on screen.

---

### Judge Psychology Notes

- **First 10 seconds decide everything.** Open with beauty — make them feel before you explain.
- **Show AI doing real things.** Let the Concierge respond live — latency, typing indicator, specific reasoning signal real implementation.
- **Speed implies competence.** Move confidently. Don't linger except on the Concierge demo.
- **Specificity beats breadth.** One feature working beautifully beats five features feeling shallow.
- **GitHub matters.** Clean code, excellent README, consistent commits signal engineering maturity.

---

## PART 7: COMPLETE DAILY EXECUTION SCHEDULE

### Phase 1 — Pre-Registration: Strategy & Setup (30 May – 14 June)

#### May 30 (Today)
- **Morning**: Commit to LUNÉVIA brand, register domain (lunevia.in or .vercel.app)
- **Afternoon**: Create GitHub repo, init `npx create-next-app@latest lunevia`
- **Evening**: Install shadcn/ui, Framer Motion, configure TypeScript
- **Night**: Set up Supabase project, configure environment variables

#### May 31
- **Morning**: Build `globals.css` — all LUNÉVIA CSS variables, typography scale
- **Afternoon**: Design system components: Button, Badge, Card base styles
- **Evening**: Navbar + Footer components
- **Night**: Supabase schema — create all tables

#### June 1
- **Morning**: Write mock salon data (15 entries, rich JSON with real Delhi locations)
- **Afternoon**: SalonCard component (first pass)
- **Evening**: SalonGrid layout on Explore page
- **Night**: Basic routing, page shells for all 8 pages

#### June 2–5 (Core Build Block)
- Landing page: Hero, stats, how-it-works, featured carousel
- Explore page: Grid + filters sidebar
- Salon detail page: gallery, services accordion, reviews section
- Booking flow: 3-step wizard (select → confirm → done)
- First Vercel deploy — working URL

#### June 6–8 (AI Block)
- LUNÉVIA Concierge: `/api/ai/concierge` route + chat widget UI
- Supabase Auth integration (Magic Link)
- AI Hairstyle Analyzer: Gemini Vision API integration
- AI Package Builder: 5-question wizard + OpenAI call

#### June 9–11
- AI Review Summarizer
- AI Bridal Timeline Generator
- Profile page + saved salons
- **Buffer day** — catch up, fix bugs, rest

#### June 12–14
- Framer Motion animations throughout every page
- Skeleton loading states on all data pages
- Mobile responsiveness first full pass
- **Stable pre-registration deploy** — full end-to-end flow working at lunevia.vercel.app

---

### Phase 2 — Registration Window (14–15 June)

#### June 14
- Register for hackathon — submit working lunevia.vercel.app URL
- Full end-to-end review — fix any blocking bugs

#### June 15 (Strategic Rest Day)
- Full recharge — no coding
- Outline demo video script, plan screen recording setup
- Review judging criteria one more time

---

### Phase 3 — Build Sprint (16–21 June) ← The Real War

#### June 16 — Day 1
- **Morning**: Full audit — every page on mobile (375px) + desktop (1440px)
- **Afternoon**: Stress-test all AI features with edge case inputs
- **Evening**: Mehendi Style Matcher page
- **Night**: Wishlist + 2-salon comparison feature

#### June 17 — Day 2
- **Morning**: AI Bridal Timeline Generator UI polish
- **Afternoon**: Landing page final pass — hero animations, scroll reveals
- **Evening**: Reviews section — add rich mock reviews to all 15 salons
- **Night**: Performance pass — `next/image`, lazy loading, bundle size check

#### June 18 — Day 3
- **Morning**: Animated onboarding wizard (3 steps, Framer Motion)
- **Afternoon**: LUNÉVIA Concierge — Hindi language support (1 line in system prompt)
- **Evening**: Mobile responsiveness deep pass — every single page
- **Night**: Buffer / catch up on anything behind schedule

#### June 19 — Day 4
- **Morning**: Production environment check — all env vars, API key limits, error handling
- **Afternoon**: 404 page, error states, empty states — all polished to match brand
- **Evening**: GitHub cleanup — README, folder structure, code comments
- **Night**: Write Project Description (use brand story) + AI Workflow Explanation doc

#### June 20 — Day 5
- **Morning**: Final UI pass — typography consistency, spacing, color audit across every page
- **Afternoon**: Record demo video (2–3 takes, follow Part 6 script)
- **Evening**: Edit video — trim, captions, background music (lofi instrumental)
- **Night**: Write README.md header, badges, setup instructions, screenshots

#### June 21 — Day 6
- **Morning**: End-to-end user flow test — pretend you are a judge seeing this for the first time
- **Afternoon**: Final Vercel production deploy — confirm every feature works at lunevia.vercel.app
- **Evening**: Rest. Seriously. Your brain needs it.
- **Night**: Prepare all submission assets in one folder: URL, GitHub link, video, description, AI doc

---

### Phase 4 — Submission Day (22 June)

- **Morning**: Open every page of lunevia.vercel.app from an incognito window on your phone
- Submit: Live URL + GitHub + Demo Video + Project Description + AI Workflow Explanation
- Confirm GitHub is public, README is excellent
- **Submit at least 2 hours before the deadline — never at the last minute**

---

### Phase 5 — Evaluation Period (24–27 June)

- Keep Vercel deployment live — do NOT push breaking changes
- Monitor Vercel dashboard for any production errors
- Rest, reflect, and be ready to celebrate on June 28

---

## PART 8: HACKATHON WINNING STRATEGY

### Common Mistakes (That You Will Not Make)

**Mistake 1 — Building too much, polishing nothing.** Most teams try 20 features. The result: a broken mess. Your strategy: 5 features that work flawlessly and look beautiful.

**Mistake 2 — Ugly AI integration.** Showing raw JSON output is not AI integration. Your AI features must be *designed* — responses render as beautiful cards, not text blobs.

**Mistake 3 — Ignoring mobile.** Test every page at 375px width. Judges always think "would I use this on my phone?"

**Mistake 4 — Bad video.** A brilliant product with a poorly recorded video loses to a mediocre product with a compelling demo. Record in a quiet room, use OBS or Loom, add light background music.

**Mistake 5 — Weak README.** Your README is a proxy for engineering maturity. Judges reviewing your GitHub should immediately understand: what it is, how to run it, what AI is used, and how the architecture works.

---

### Psychological Tricks for Judges

**The 10-Second Rule**: Your LUNÉVIA landing page must communicate luxury + innovation + clear value proposition within 10 seconds. The hero section is designed exactly for this.

**Feel first, understand later.** Lead with the story: "10 million Indian weddings" — not "we built a booking platform."

**Specificity beats generic every time.** "Neha Kapoor Bridal Studio, Lajpat Nagar, starting from ₹18,000" feels more real than "Salon A, Location B." Write your mock data this way.

**Let the AI do something impressive during their evaluation.** Pre-fill a sample query in the LUNÉVIA Concierge input field so judges can run it in one click. Lower the friction to experiencing the wow moment.

---

### How to Make the Project Look More Advanced

- **Real Indian names, real Delhi localities, real price ranges** in your mock data
- **Verified badge system** — implies an operational vetting process
- **Aspirational mock stats** — "2,400+ artists," "15,000+ weddings" — plausible, signals scale
- **Skeleton loaders** — makes the app look like a production build, not a hackathon project
- **Framer Motion page transitions** — `y: 20→0, opacity: 0→1` on every page navigation. 30 minutes of work, 10x perceived quality increase
- **Dark-to-light gradient on hero cover images** — makes photos look curated, not random

---

### What Judges Actually Remember (In Order)

1. LUNÉVIA Concierge doing something visually impressive in real-time
2. The landing page's emotional first impression
3. The mobile experience feeling like a real app
4. One specific clever feature they haven't seen before (AI Bridal Timeline)
5. Overall design consistency — every page feeling like the same product

They will NOT remember: your database schema, TypeScript generics, or API architecture. They are evaluating a **product**, not code.

---

## PART 9: SUBMISSION CHECKLIST

### Product
- [ ] Landing page loads in under 3 seconds
- [ ] All pages work at 375px mobile width
- [ ] LUNÉVIA Concierge gives a real, impressive response
- [ ] Hairstyle Analyzer accepts an image and returns results
- [ ] Booking flow completes without errors
- [ ] Zero console errors on any page

### Design
- [ ] All pages use LUNÉVIA brand colors consistently
- [ ] Typography consistent: Cormorant Garamond (display), DM Sans (UI)
- [ ] All images properly cropped and optimized
- [ ] Loading skeleton states on every async operation
- [ ] Graceful error/fallback states on all AI features

### Submission Assets
- [ ] Live URL: lunevia.vercel.app resolves and loads correctly
- [ ] GitHub repo is public
- [ ] README.md: setup, features, AI explanation, screenshots
- [ ] Demo video: 2–3 min, clearly narrated, shows all key features
- [ ] Project description includes the LUNÉVIA brand story
- [ ] AI Workflow Explanation covers all 3+ AI features

### Day-Of
- [ ] Submit at least 2 hours before deadline
- [ ] Test lunevia.vercel.app from incognito window + on your phone
- [ ] Verify GitHub link is correct and repo loads

---

## README.md Template

```markdown
# LUNÉVIA
### Your most beautiful day, designed by AI.

Delhi's premier AI-powered bridal beauty marketplace.

![LUNÉVIA Hero](./public/og-image.png)

## Live Demo
🌐 [luneviaa.vercel.app](https://luneviaa.vercel.app)

## What is LUNÉVIA?
LUNÉVIA is a luxury bridal beauty platform built for Delhi brides.
It combines a curated marketplace of verified artists with LUNÉVIA Concierge —
an AI-powered beauty consultant that matches brides to their perfect look.

## AI Features
| Feature | Technology | Description |
|---------|-----------|-------------|
| LUNÉVIA Concierge | OpenAI GPT-4o-mini | Natural language bridal beauty matching |
| Hairstyle Analyzer | Google Gemini Vision | Face shape analysis + hairstyle recommendations |
| Package Builder | OpenAI GPT-4o-mini | Custom bridal package generation |
| Bridal Timeline | OpenAI GPT-4o-mini | Month-by-month beauty prep schedule |
| Review Summarizer | OpenAI GPT-4o-mini | AI-generated salon review summaries |

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Components**: shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: OpenAI API, Google Gemini API
- **Deployment**: Vercel

## Getting Started
\`\`\`bash
git clone https://github.com/yourusername/lunevia
cd lunevia
npm install
cp .env.example .env.local
# Add your API keys to .env.local
npm run dev
\`\`\`

## Environment Variables
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
\`\`\`

## Built for
AI Startup Buildathon 2026 — SuperXgen AI Builder Series
```

---

*LUNÉVIA — Built at IIT Mandi. Submitted for AI Startup Buildathon 2026.*
*"Your most beautiful day, designed by AI."*



# LUNÉVIAA — Artist/Salon Side Context

## Overview

LUNÉVIAA is a two-sided marketplace. The customer side lets brides discover, compare, and book bridal artists. The artist/salon side is the mirror image — every piece of information a customer sees must originate from an artist-controlled dashboard. Nothing on the public-facing salon pages should be hardcoded or admin-only; the artist owns and edits their own presence on the platform.

---

## Feature Mapping — Customer View → Artist Control

| Customer Sees | Artist Controls | Dashboard Page |
|---|---|---|
| Salon name, description, photos | Profile editor — edit all info | `/artist/dashboard/profile` |
| Services & pricing | Service menu manager — add/edit/delete | `/artist/dashboard/services` |
| Portfolio gallery | Photo uploader — upload, reorder, delete | `/artist/dashboard/portfolio` |
| Availability calendar | Set working hours, block dates | `/artist/dashboard/availability` |
| Reviews & ratings | Read reviews, flag inappropriate ones | `/artist/dashboard/reviews` |
| Verified badge | Verification status (admin-approved) | Read-only on profile |
| Booking confirmation | Accept/decline/reschedule requests | `/artist/dashboard/bookings` |
| Team members shown | Add team members with roles | `/artist/dashboard/profile` |
| Location on map | Set address, service area | `/artist/dashboard/profile` |
| Specialty tags | Choose specialties | `/artist/dashboard/profile` |

---

## Artist-Side Routes

```
app/
├── artist/
│   ├── login/page.tsx              # Separate artist login/signup
│   ├── onboarding/page.tsx         # First-time 4-step setup wizard
│   └── dashboard/
│       ├── page.tsx                # Home — stats overview
│       ├── profile/page.tsx        # Edit salon profile
│       ├── services/page.tsx       # Manage service menu
│       ├── portfolio/page.tsx      # Upload/manage portfolio photos
│       ├── availability/page.tsx   # Working hours + blocked dates
│       ├── bookings/page.tsx       # Booking inbox
│       └── reviews/page.tsx        # View reviews (read-only)
└── api/
    ├── bookings/route.ts           # POST — create booking (called by customer)
    ├── bookings/[id]/route.ts      # PATCH — accept/decline (called by artist)
    └── salons/[id]/route.ts        # GET/PATCH — fetch or update salon
```

---

## Authentication & Role Separation

Artists and customers share the same Supabase Auth system but are distinguished by a `role` field on the `profiles` table.

- `role: 'customer'` → redirected to `/profile` after login
- `role: 'artist'` → redirected to `/artist/dashboard` after login

**Artist signup flow:**

1. Artist signs up at `/artist/login` (separate page from customer login)
2. On signup, `role` is set to `'artist'` in the profiles table
3. Redirected to `/artist/onboarding` — a 4-step wizard
4. On completion, a new row is created in the `salons` table with `owner_id` set to the artist's user ID and `is_published: false`
5. Artist manually toggles `is_published: true` from their profile editor when ready to go live

---

## Page-by-Page Detail

### 1. Artist Login (`/artist/login`)

A login/signup page visually distinct from the customer `/login` page — same brand system but framed as "Join LUNÉVIAA as an Artist" rather than "Welcome back, bride."

- Email + password signup/signin via Supabase Auth
- "New artist? Apply to join LUNÉVIAA" toggle
- On successful signup: set `role: 'artist'`, redirect to `/artist/onboarding`
- On successful signin: check `role`, redirect to `/artist/dashboard`

---

### 2. Artist Onboarding (`/artist/onboarding`)

A 4-step wizard with Framer Motion transitions between steps (same animation style as the rest of the app: fade + y:20→0, 400ms).

**Step 1 — Basic Info**
- Salon/studio name
- Locality (dropdown of real Delhi areas: Lajpat Nagar, Hauz Khas, Punjabi Bagh, South Ex, Greater Kailash, etc.)
- Specialty tags (multi-select: Bridal Makeup, Mehendi, Hair Styling, Pre-Bridal Packages)
- Short description (textarea, ~150 word limit)

**Step 2 — Contact & Location**
- Phone number
- Instagram handle
- WhatsApp number
- Full address (text input, used for the map embed later)

**Step 3 — Services**
- Must add at least 1 service before proceeding
- Each service: name, duration, price, category tag
- "Add another service" button to add more inline

**Step 4 — Cover Photo**
- Upload a cover image (drag-drop or file picker → Supabase Storage)
- This becomes the hero image on their public salon detail page

On final submission: a new `salons` row is created with all collected data, `is_published: false` by default. Artist lands on `/artist/dashboard` with a banner: "Your profile is saved as a draft. Publish it when you're ready."

---

### 3. Dashboard Home (`/artist/dashboard`)

The artist's command center.

**Stats overview cards** (4-card grid):
- Total bookings this month
- Pending bookings (highlighted/badged if count > 0 — this should visually demand attention)
- Average rating (pulled from reviews table)
- Profile views (can be a simple incrementing counter, doesn't need to be perfectly accurate for hackathon purposes)

**Quick action buttons:**
- "View Pending Bookings" → links to bookings page filtered to pending
- "Add New Service" → links to services page
- "Upload Portfolio Photos" → links to portfolio page

**Recent activity table:** last 5 bookings with customer name, service, date, status

**Publish status banner:** if `is_published: false`, show a persistent banner: "Your profile is not visible to customers yet. [Publish Now]" linking to the profile editor.

---

### 4. Profile Editor (`/artist/dashboard/profile`)

The single source of truth for everything shown on the public `/salon/[slug]` page.

Editable fields:
- Salon/studio name
- Description (textarea)
- Locality + full address
- Specialty tags (multi-select, same options as onboarding)
- Price range indicator (₹ / ₹₹ / ₹₹₹)
- Cover image (re-uploadable)
- Contact: phone, email, Instagram, WhatsApp
- Team members: name + role (e.g. "Lead Makeup Artist", "Mehendi Specialist") — add/remove rows

**Publish toggle:** a prominent switch — `is_published: true/false`. When off, the salon does not appear in `/explore` or in AI Concierge recommendations, and direct visits to `/salon/[slug]` show a "this profile is not yet live" state.

Save button updates the corresponding row in the `salons` table. Changes should reflect immediately on the public page — no caching delay for the hackathon demo.

---

### 5. Service Menu Manager (`/artist/dashboard/services`)

- List view of all current services, each with edit and delete icon buttons
- "Add Service" opens an inline form (not a separate page — keep it fast):
  - Service name (e.g. "HD Bridal Makeup")
  - Duration (e.g. "3 hours")
  - Price (₹ amount, numeric input)
  - Description (optional, short)
  - Category tag (Bridal Makeup / Pre-Bridal / Hair / Mehendi / Other)
- Services should be drag-reorderable (the order here is the order shown on the public Services & Pricing accordion)
- Stored as a `jsonb` array on the `salons.services` column — no separate table needed for hackathon scope

---

### 6. Portfolio Manager (`/artist/dashboard/portfolio`)

- Grid layout of currently uploaded photos, each with a delete (×) button on hover
- Drag-and-drop upload zone at the top — uploads go to Supabase Storage, URLs appended to `salons.gallery_images`
- Maximum 20 photos (soft limit, just don't let the upload UI accept more)
- Photos should be reorderable by drag — order here matches the order shown in the public Portfolio masonry grid
- Empty state: if no photos yet, show an illustrated empty state with "Upload your first photo" CTA — never show a blank grid

---

### 7. Availability Manager (`/artist/dashboard/availability`)

Two sections on one page:

**Weekly hours grid** — one row per day (Mon–Sun), each row has:
- Toggle: Open / Closed
- If open: start time + end time pickers

**Blocked dates calendar** — a month-view calendar where the artist clicks individual dates to mark them unavailable (festivals, personal leave, fully booked days). Blocked dates appear visually distinct (e.g. struck through or shaded).

Both are saved to the `salons` table: `working_hours` (jsonb) and `blocked_dates` (date array). The customer-facing booking flow at `/book/[salonId]` must respect both — blocked dates and outside-of-hours slots should not be selectable.

---

### 8. Booking Inbox (`/artist/dashboard/bookings`)

The most operationally important page — this is where revenue happens.

- Filter tabs at top: All · Pending · Confirmed · Completed · Declined
- List of bookings, newest first, each as a card showing:
  - Customer name + phone number
  - Service requested
  - Date + time slot
  - Total amount
  - Any customer notes
  - Status badge (color-coded: pending=gold, confirmed=green, declined=rose, completed=charcoal)
- **Pending bookings get two action buttons:** "Confirm" and "Decline"
  - Confirm → PATCH to `/api/bookings/[id]`, status becomes `confirmed`
  - Decline → opens a small reason input (optional), then PATCHes status to `declined`
- Pending bookings should be visually prioritized at the top regardless of date, since they require action

---

### 9. Reviews Dashboard (`/artist/dashboard/reviews`)

Read-only — artists cannot edit or delete customer reviews, only view and flag.

- List of all reviews for their salon, newest first
- Each review: star rating, review text, customer name, date, "verified booking" badge if applicable
- "Flag for review" button on each — for hackathon scope this can just mark a boolean field, no actual admin moderation flow needs to be built
- Summary header showing: average rating (large number), total review count, and a simple rating distribution bar (5-star: x%, 4-star: y%, etc.)

---

## Database Fields Required for Artist Side

Add these fields to the existing `salons` table:

```sql
owner_id uuid REFERENCES auth.users,      -- which artist owns this salon
working_hours jsonb,                       -- {mon: {open: true, start: "10:00", end: "19:00"}, ...}
blocked_dates date[],                      -- array of unavailable dates
is_published boolean DEFAULT false         -- artist controls public visibility
```

Add this field to `profiles`:

```sql
role text DEFAULT 'customer'               -- 'customer' | 'artist'
```

---

## What the Artist Side Should NOT Include

To keep scope realistic for the build sprint:

- No payment processing or payout management (out of scope — bookings are informational, payment happens offline/in-person)
- No multi-team-member login (one login per salon, even if they list multiple team members on their profile)
- No admin moderation panel (review flagging just sets a boolean — no actual moderation workflow needs to be built)
- No analytics beyond the basic stats cards on the dashboard home
- AI features (Concierge, Hairstyle Analyzer, Package Builder, Timeline) remain customer-only — artists do not get an AI dashboard

---

## Submission Checklist Addition — Artist Side

- [ ] Artist can sign up and complete onboarding wizard
- [ ] Artist dashboard home shows live stats
- [ ] Profile editor changes reflect on public `/salon/[slug]` page
- [ ] Service add/edit/delete works and reflects publicly
- [ ] Portfolio upload works, photos appear publicly
- [ ] Blocked dates actually prevent those dates being booked by customers
- [ ] Booking confirm/decline updates status and customer sees updated status
- [ ] Publish toggle actually hides/shows salon from `/explore`