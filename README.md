# LUNÉVIA — Delhi's Premier Bridal Beauty Marketplace

LUNÉVIA is a full-stack luxury bridal booking platform that connects Delhi brides with verified makeup artists, hairstylists, and bridal studios. Built for the massive Indian wedding market, it offers a seamless end-to-end experience — from browsing curated artist profiles to booking appointments — all enhanced by powerful AI tools that help brides discover and plan their perfect look.

---

## 🎯 Project Overview

LUNÉVIA is a two-sided marketplace serving both customers (brides) and service providers (artists/salons):

**For Brides (Customers):**
1. **Discover** — Browse and filter verified bridal salons across Delhi.
2. **Book** — Select a service, pick a date and available time slot, and confirm a booking in minutes.
3. **Navigate** — Use built-in Google Maps links to get directions directly to the salon.
4. **Be Inspired** — Use optional AI tools (Face-Shape Hairstyle Analyzer, LUNÉVIA Concierge, AI Package Builder, AI Bridal Timeline) to plan the perfect look.

**For Artists (Salons):**
1. **Manage Profile** — Create and update a fully branded public-facing salon page with photos, services, Google Maps location, and bio.
2. **Control Bookings** — Accept, confirm, or decline appointments via a dedicated dashboard. Bookings auto-transition to `Completed` once the service time has elapsed.
3. **Grow Reputation** — Automatically aggregated 5-star reviews from verified customers drive placement in the "Featured Artists" homepage section.

---

## 📱 Key Features

- **Two-Sided Marketplace**: Fully operational for both customers (booking) and artists (full dashboard management).
- **Real-Time Booking Engine**: Supabase-powered scheduling engine with slot conflict prevention.
- **Auto-Completion Logic**: The system parses service durations (including decimals like `0.5 hrs`) and auto-transitions `Confirmed` bookings to `Completed` once the appointment time + service duration has passed.
- **Artist Control Panel**: Complete dashboard for managing profiles, portfolios, bookings, services, and payment tracking.
- **Automated Reputation System**: Database triggers auto-calculate and update artist ratings instantly when a review is submitted.
- **LUNÉVIA Concierge (AI)**: A Gemini-powered chatbot connected to the live salon database that recommends real artists based on user prompts.
- **AI Hairstyle Analyzer**: A privacy-first, client-side face-shape tool using MediaPipe + Gemini. A supplementary AI feature.
- **AI Package Builder**: A 5-step wizard that gathers the bride's preferences and generates a fully custom bridal package recommendation using Gemini.
- **AI Bridal Timeline Generator**: Auto-generates a personalized month-by-month beauty preparation schedule from the bride's wedding date.
- **Google Maps Integration**: Artists set their salon location; customers navigate with one click from any salon card or detail page.
- **Smart Auth Redirect**: New users are auto-redirected to complete their profile on first login.
- **Responsive Luxury UI**: Built with Next.js 14, Tailwind CSS, and Framer Motion with a ceremonial gold-on-dark design language.

---

## 🗺️ Pages & Features

### 1. Home Page (`/`)
- **Hero Section**: Tagline with a smart search bar that passes queries via `?q=` URL parameters directly into the Explore page.
- **Dynamic Featured Artists**: Top-4 salons ranked by live Supabase reputation score — never hardcoded.
- **How It Works**: 3-step scroll-reveal explanation of the platform.
- **Stats Bar**: Platform-wide numbers (artists, weddings, bookings).
- **Testimonials Section**: Mix of hardcoded showcase reviews and live Supabase data.
- **Concierge Banner**: Highlights the LUNÉVIA Concierge AI feature.

---

### 2. Explore Page (`/explore`)
- **URL-Aware Search**: Reads `?q=` query parameters on load so Hero search passes seamlessly.
- **Salon Cards**: Each card shows the salon's name, rating, specialty, price range, and location tag.
- **Google Maps Shortcut**: Every card has a 'Map' button that opens the salon's location in Google Maps using `e.stopPropagation()` to avoid unwanted card navigation.
- **Filter & Search**: Filter salons by specialty, locality, and price range.

---

### 3. Salon Detail Page (`/salon/[slug]`)
- **Full Salon Profile**: Displays the salon's name, cover image, description, specialties, address, and contact info — all live from Supabase.
- **Google Maps Navigate Button**: A solid-gold "Navigate" button linking directly to the salon's saved map URL.
- **Services Menu**: Lists all services the artist has added via their dashboard, including price, duration, and category.
- **Portfolio Gallery**: Masonry grid of photos uploaded by the artist to Supabase Storage. Includes a lightbox with zoom in/out functionality.
- **Interactive Reviews Section**:
  - Displays all customer reviews, showing the reviewer's full name (not email).
  - Signed-in customers can submit a rating using an interactive 5-star hover UI and leave a written review.
  - Reviews auto-scroll into view via URL hash `#reviews`.
- **Book Now Button**: Directly links to the booking flow.

---

### 4. Booking Page (`/book/[slug]`)
- **3-Step Wizard**: A clean, animated progress indicator (Select Service → Choose Time → Confirmation).
- **Service Selection**: Lists all services from the salon's live menu with price and duration.
- **Date & Time Selection**: Calendar-style date picker with available time slots (9 AM–5 PM).
- **Real-Time Conflict Prevention**: Fetches existing `pending`/`confirmed` bookings from Supabase and greys out already-taken time slots.
- **Auto-Profile Save**: On confirmation, the customer's name and phone number are saved to their profile automatically for future convenience.
- **Booking Confirmation Screen**: A beautiful success state with booking summary.

---

### 5. LUNÉVIA Concierge (`/concierge` + Global Widget)
- **Floating Chat Widget**: Available on every customer-facing page via a bottom-right toggle button.
- **Full Concierge Page**: Expanded chat interface at `/concierge`.
- **Live Database Context**: Queries Supabase on each conversation to include up-to-date salon names, specialties, and ratings in the AI's context window.
- **Gemini AI Powered**: Uses Google Gemini API to generate contextual, persona-aware responses recommending real artists.
- **Session Memory**: Message history is preserved within the browser session.
- **Context-Aware Suggestions**: Can cross-reference the user's previously analyzed face shape for personalized styling advice.
- **Vernacular Support**: The AI auto-detects the user's language and seamlessly responds in English or Hindi, catering perfectly to the local Delhi market.

---

### 6. AI Hairstyle Analyzer (`/hairstyle`)
One of LUNÉVIA's supplementary AI tools — a privacy-first, client-side face analysis feature:
- **Face Photo Upload**: Accepts JPG, PNG, WebP formats.
- **Client-Side Detection**: MediaPipe Tasks Vision runs entirely in the browser — the image is never sent to a server. Detects 468 facial landmarks.
- **Geometric Measurement Extraction**: Calculates face length, jaw width, forehead width, and cheekbone width as pixel ratios.
- **Gemini Classification**: Sends only the numeric ratios (not the photo) to Google Gemini to classify the face shape into 8 categories (Oval, Round, Square, Heart, Diamond, Rectangle, Triangle, Inverted Triangle).
- **Personalized Recommendations**: Returns 3 tailored bridal hairstyles with the style name, why it works for the face shape, and best occasion.
- **Confidence Indicator**: Displays classification confidence (High / Medium / Low).
- **Debug Toggle**: Shows raw extracted measurements for transparency.

---

### 7. AI Package Builder (`/package-builder`)
- **5-Step Preference Wizard**: Gathers Wedding Date, Budget Range, Services Needed, Aesthetic Style, and Skin Tone + Notes.
- **Auth-Gated**: Requires login before the wizard begins.
- **Gemini-Generated Package**: Sends the answers to the Gemini API and receives a structured custom bridal package recommendation.
- **Package Output**: Displays the suggested package name, included services, estimated timeline, and a dynamic Top Artist Match directly linked from the active salon database.
- **One-Click Save**: Brides can instantly save their customized bridal package directly to their profile dashboard for future reference.

---

### 8. AI Bridal Timeline Generator (`/timeline`)
- **Wedding Date Input**: Accepts a wedding date from the user.
- **Profile Auto-Fill**: Automatically reads the user's saved `wedding_date` from their Supabase profile and pre-fills the date field, then auto-generates the timeline.
- **Month-by-Month Schedule**: Gemini generates a personalized beauty preparation schedule (e.g., "6 months before: Book bridal trial", "1 month before: Mehendi consultation").
- **Visual Timeline Nodes**: Each milestone is rendered as a beautiful, animated `TimelineNode` component.

---

### 9. Platform Reviews (`/reviews`)
- **Showcase Testimonials**: A set of hardcoded premium testimonials from "featured" brides for demonstration.
- **Live Database Reviews**: Fetches and displays all real reviews from the `site_reviews` Supabase table.
- **Interactive 5-Star Submission Form**: Brides enter their name, location, rating (via interactive hover-to-select stars), and comment.
- **Identity Display**: Author names are displayed as submitted — no email leakage.

---

### 10. Authentication (`/login`)
- **Dual-Role Login UI**: A single login page with two distinct cards — one for Brides and one for Artists — each routing the user to the correct experience after login.
- **Supabase Auth**: Email + Password sign in and sign up, both handled on the same page with a toggle.
- **Smart New-User Redirect**: First-time users are automatically routed to the profile completion page (`/profile`) instead of the homepage.

---

### 11. Customer Profile & Dashboard (`/profile`)
- **Profile Editor**: Brides can update their full name, wedding date, location, and budget range.
- **My Bookings**: Displays all active (upcoming) bookings with service name, date, time slot, status badge, and amount.
- **Past Bookings**: Separate section for completed and declined bookings.
- **Budget Tracker**: Calculates total spend and remaining budget from actual booking amounts.
- **Saved / Wishlisted Salons**: Shows all salons the user has hearted/saved, rendered as `SalonCard` components.
- **Saved Bridal Packages**: Displays AI-generated bridal packages saved from the Package Builder, complete with timeline and recommended artist links.
- **Assigned Stylist Details**: Bookings now display the assigned makeup artist's name and direct phone number for easy coordination.
- **AI Recommendations**: Suggests salons based on the bride's saved location and budget preferences.
- **Sign Out**: Clean logout routing back to `/login`.

---

### 12. Artist Login & Onboarding (`/artist/login`, `/artist/onboarding`)
- **Artist-Only Login**: Separate login/signup page routed exclusively for salon owners.
- **4-Step Onboarding Wizard** (for first-time artists): Covers Salon Basics, Contact Info, Services, and Cover Photo.
  - **Basics**: Salon name, Delhi locality selector, specialty tags (Bridal Makeup, Mehendi, Hair, Pre-Bridal), description.
  - **Contact**: Phone, full address, Instagram, WhatsApp, email.
  - **Services**: Add multiple service rows with name, duration (e.g., `2 hrs`, `0.5 hrs`), price, and category.
  - **Photo**: Cover image upload directly to Supabase Storage with live preview.
- **Slug Auto-Generation**: A URL-safe salon slug is auto-generated from the salon name with a random suffix for uniqueness.

---

### 13. Artist Dashboard (`/artist/dashboard`)
A complete internal management portal with a custom artist-only layout (no customer Navbar/Footer). Includes an `ArtistTopBar` with navigation links to all sections.

#### Overview Page
- **Salon Status Badge**: Shows whether the salon is `Published` or in `Draft`.
- **Quick Stats**: Pending bookings count, monthly bookings count.
- **Recent Bookings Feed**: Shows the latest 5 bookings with status at a glance.
- **Publish Prompt**: If the salon is unpublished, shows a banner to guide the artist to publish.

#### Bookings (`/artist/dashboard/bookings`)
- **Filter Tabs**: Filter by All, Pending, Confirmed, Completed, Declined.
- **Real-Time Updates**: Supabase `postgres_changes` channel subscription auto-refreshes the list when new bookings arrive.
- **Confirm / Decline Actions**: One-click confirm button; decline opens an inline reason input field before submitting.
- **Auto-Completion Engine**: On every page load, checks every `confirmed` booking against the current time. Parses service duration strings (including decimals like `0.5 hrs`) and automatically flips status to `completed` in the UI and pushes the change to Supabase.
- **Payment Tracking**: Artists can log partial or full payment received for each booking. Amount is saved to the `bookings` table.

#### Team Management (`/artist/dashboard/team`)
- **Staff Directory**: Add and manage individual makeup artists, hairstylists, and assistants within the salon.
- **Contact Syncing**: Staff phone numbers and roles are saved and automatically shared with brides when a team member is assigned to their booking.

#### Services (`/artist/dashboard/services`)
- **Service Manager**: Add, edit, and delete services from a clean table UI.
- **Fields**: Name, category, duration, price.
- **Live Sync**: Changes instantly propagate to the public-facing Salon Detail page.

#### Portfolio (`/artist/dashboard/portfolio`)
- **Photo Upload**: Upload images directly from device to Supabase Storage.
- **Portfolio Grid**: View all uploaded photos in a masonry grid.
- **Delete Photos**: Remove individual portfolio photos with a single click.

#### Profile (`/artist/dashboard/profile`)
- **All Salon Fields Editable**: Name, description, locality, specialties, contact info (phone, address, Instagram, WhatsApp, email).
- **Google Maps Location**: Paste a Google Maps share link directly into the profile — this powers the "Navigate" button on the public salon card and detail page.
- **Publish / Unpublish Toggle**: Artists control whether their salon is publicly visible on the Explore page.

#### Availability (`/artist/dashboard/availability`)
- Set working hours and mark off blocked/unavailable dates.

#### Reviews (`/artist/dashboard/reviews`)
- Read-only view of all customer reviews submitted for the salon.
- Shows reviewer name, star rating, comment, and submission date.

---

## 🧭 Navigation Map

```
Home (/)
├── Smart Search → /explore?q=...
├── Featured Artists → /salon/[slug]
├── Testimonials
└── CTA Buttons → /explore, /concierge

Explore (/explore)
├── Filter & Search Salons
└── Salon Cards → /salon/[slug] (Map button → Google Maps)

Salon Detail (/salon/[slug])
├── Navigate → Google Maps
├── Services, Portfolio, Reviews
└── Book Now → /book/[slug]

Booking (/book/[slug])
├── Service Selection
├── Date & Time (conflict-aware)
└── Confirmation

AI Features
├── /hairstyle       — Face shape analyzer
├── /concierge       — Floating widget + full page
├── /package-builder — 5-step custom package wizard
└── /timeline        — Wedding prep timeline

Customer Account
├── /login           — Dual-role login (Bride / Artist)
└── /profile         — Dashboard, bookings, budget, saved salons

Artist Portal
├── /artist/login
├── /artist/onboarding
└── /artist/dashboard
    ├── / (Overview)
    ├── /bookings
    ├── /services
    ├── /portfolio
    ├── /profile
    ├── /availability
    └── /reviews

Static Pages
├── /about
├── /contact
├── /reviews (Platform Reviews)
├── /privacy
└── /terms
```

---

## 🎨 Design System

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| PRIMARY | `#1A0A00` | Deep ceremonial black — backgrounds, main text |
| GOLD | `#C9933A` | Heritage gold — CTAs, highlights, borders |
| BLUSH | `#F5E8DC` | Warm ivory — cards, secondary backgrounds |
| ROSE | `#C4687A` | Muted rose — tags, hover states |
| CREAM | `#FAF6F0` | Off-white — main page surfaces |
| CHARCOAL | `#2E1F1F` | Dark warm brown — secondary text, icons |

### Typography
- **Display / Hero**: *Cormorant Garamond* — tall, elegant serifs for luxury feel.
- **Body / UI**: *DM Sans* — clean, modern, highly legible.

### Animations
- All page transitions: `opacity 0→1`, `y: 20→0`, 400ms ease-in-out via Framer Motion.
- Staggered card lists: 80ms between items.
- Scroll-reveal: `whileInView` Framer Motion triggers.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS v3, custom CSS variables |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| AI | Google Gemini API (Concierge, Hairstyle, Package, Timeline) |
| Face Detection | MediaPipe Tasks Vision (client-side only) |
| Deployment | Vercel |

---

## 📁 Project Structure

```
app/
├── page.tsx                        # Home
├── explore/                        # Browse salons
├── salon/[slug]/                   # Salon detail
├── book/[slug]/                    # Booking flow
├── concierge/                      # Full Concierge page
├── hairstyle/                      # AI Hairstyle Analyzer
├── package-builder/                # AI Package Builder
├── timeline/                       # AI Bridal Timeline
├── reviews/                        # Platform reviews
├── profile/                        # Customer dashboard
├── login/                          # Dual-role login
├── artist/
│   ├── login/                      # Artist-only login
│   ├── onboarding/                 # 4-step setup wizard
│   └── dashboard/
│       ├── page.tsx                # Overview + stats
│       ├── bookings/               # Booking manager
│       ├── services/               # Service menu editor
│       ├── portfolio/              # Photo uploader
│       ├── profile/                # Salon profile editor
│       ├── availability/           # Working hours
│       └── reviews/                # Review reader
├── api/ai/
│   ├── concierge/route.ts
│   ├── hairstyle/route.ts
│   ├── package/route.ts
│   └── timeline/route.ts
├── about/
├── contact/
├── privacy/
└── terms/

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
├── layout/Navbar.tsx, Footer.tsx, ArtistTopBar.tsx
└── ui/Badge.tsx, LuneviaButton.tsx, SalonCard.tsx, TimelineNode.tsx

lib/
├── supabase.ts
├── gemini.ts
├── faceMesh.ts
├── hooks/useArtistSalon.ts
└── types/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Supabase project with tables: `salons`, `bookings`, `reviews`, `site_reviews`, `profiles`
- Google Gemini API Key

### Install & Run

```bash
git clone https://github.com/ranjanpritish16/LUNEVIA.git
cd LUNEVIA
npm install
cp .env.example .env.local
# Fill in your keys in .env.local
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🌐 Live Demo

**[luneviaa.vercel.app](https://luneviaa.vercel.app)**

---

## ⚠️ Current Limitations

### Authentication
- **Email / Password login only** — Sign in and sign up are currently handled via Supabase email + password authentication.
- **Google OAuth** — Planned but not yet implemented.
- **GitHub OAuth** — Planned but not yet implemented.

---

## 🔮 Future Implementations

These features were planned as part of the product vision but are not yet built. They are listed here as the next milestone roadmap:

### Booking Enhancements
- **Trial Run Scheduling** — Add an option during the booking flow to schedule a pre-wedding trial appointment.
- **Booking Rescheduling** — Let customers reschedule a confirmed booking directly from their dashboard.

### AI Feature Upgrades
- **AI Review Summarizer on Salon Pages** — Auto-generate a 2-sentence Gemini summary ("85 brides loved her work — customers consistently praise...") at the top of every salon's reviews section.

### Discovery & Matching
- **Mehendi Style Matcher** — A gallery-based quiz (Rajasthani · Arabic · Indo-Western · Minimalist) that recommends a mehendi style and matching artists on the platform.
- **Saved Salons Comparison** — Allow brides to compare 2 wishlisted salons side-by-side (price, rating, specialties).

### Premium AI / AR Features
- **AI Before/After Visualizer** — Upload a selfie → AI applies a makeup look preview using Replicate's SDXL or similar style-transfer model.
- **Virtual Try-On (AR)** — Augmented reality bridal look preview using the device camera.

### OAuth & Social Login
- **Google Sign-In** — One-tap Google OAuth via Supabase social providers.
- **GitHub Sign-In** — GitHub OAuth for developer-friendly access.

### Platform & Operations
- **Admin Dashboard** — Internal panel for verifying new artist applications and managing the "Verified Badge" status.
- **Push Notifications** — Real-time booking alerts via browser push or WhatsApp when an artist confirms or declines.
- **Multi-city Expansion** — Extend beyond Delhi to Mumbai, Bangalore, and other tier-1 cities.

---

*LUNÉVIA — Built for AI Startup Buildathon 2026. "Your most beautiful day, designed by AI."*
