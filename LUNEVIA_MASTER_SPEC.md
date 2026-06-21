# 👑 LUNÉVIA: The Ultimate AI-Powered Bridal Ecosystem
**A Master Specification & Exhaustive Technical Walkthrough**

*This document is the definitive blueprint of the LUNÉVIA platform. It is designed to give Product Managers, AI Models, and Software Architects a complete, unadulterated view of every micro-interaction, database query, and UX philosophy embedded in the codebase.*

---

## 🎨 1. The Aesthetic Philosophy & UI Framework

LUNÉVIA rejects the sterile, purely functional look of standard booking SaaS apps. It is designed to feel like a high-end luxury bridal boutique.

### The Design System
- **Color Palette:** 
  - **Primary Gold** (`#D4AF37`): The accent color for primary actions, buttons, and decorative borders. It commands attention without being aggressive.
  - **Blush Rose** (`#FFF0F5`): A soft, feminine background shade used to break up white space and provide warmth.
  - **Charcoal** (`#1A1A1A`): Used for primary text, avoiding the harsh contrast of pure black (`#000000`) for a more refined reading experience.
  - **Cream** (`#FAFAFA`): The primary background color, providing a soft canvas.
- **Typography:**
  - **Headings:** *Cormorant Garamond* (Serif). Used for all H1/H2 tags to convey luxury, tradition, and elegance.
  - **Body Text:** *DM Sans* (Sans-Serif). Used for paragraphs and UI elements to ensure modern, crisp readability, especially on mobile devices.
- **Motion & Fluidity (Framer Motion):**
  - The UI uses `framer-motion` for stagger animations. Elements do not simply load; they fade-in-up (`y: 20`, `opacity: 0` to `y: 0`, `opacity: 1`) to simulate a gentle unveiling.

---

## 👰 2. The Customer Journey (The Bride's Perspective)

### Step 1: The Grand Entrance (Home Page - `/`)
- **Hero Section:** A massive visual statement. The primary CTA is "Find Your Perfect Style".
- **The Engine Preview:** A "How it Works" section breaks down the AI face-scanning process into three digestible steps (Upload -> AI Analyze -> Match).
- **Social Proof:** A horizontal carousel of top-rated Featured Artists, pulled dynamically.
- **Platform Reviews:** Real testimonials pulled from the `site_reviews` table, interspersed with an elegant call-to-action to leave a review.

### Step 2: The Core AI Engine (`/hairstyle`)
This is the technological crown jewel. A bride wants to know what hairstyle suits her unique bone structure.
1. **The Upload Zone:** An interactive area that accepts a high-res selfie.
2. **Client-Side Vision (MediaPipe Tasks):** 
   - *Privacy First:* The image is loaded onto an invisible HTML `<canvas>`. It is **never** sent to a server.
   - *The Scan:* Google's WebAssembly-powered MediaPipe detects exactly 468 facial landmarks.
3. **The Geometry Engine:**
   - The system maps specific landmark indices to calculate the physical pixel distance of the:
     - **Face Length** (Forehead to Chin)
     - **Jaw Width** (Jaw angle to Jaw angle)
     - **Forehead Width** (Temple to Temple)
     - **Cheekbone Width** (Cheek to Cheek)
   - It calculates relational ratios (e.g., Length-to-Width Ratio).
4. **The Generative AI (Gemini 2.5 Flash):**
   - The numerical ratios (not the image) are securely POSTed to `/api/ai/hairstyle`.
   - Gemini evaluates the math against 8 geometric face shapes (Oval, Round, Square, Heart, Diamond, Rectangle, Triangle, Inverted Triangle).
5. **The Reveal Animation:**
   - A stagger animation reveals the detected Face Shape, a Confidence Score (High/Medium/Low), and **three highly personalized bridal hairstyles**.
   - Each style includes: A title, a deep description of the aesthetic, a geometric explanation of *why* it flatters her specific face shape, and the best wedding event (e.g., Reception, Haldi) to wear it.

### Step 3: Discovery & Browsing (`/explore`)
- **Real-Time Data Matrix:** The Next.js page uses `export const revalidate = 0;` to ensure absolutely no static caching. Every time the page loads, it executes a live `SELECT` query on the Supabase `salons` table.
- **Filtering System:** Brides can filter by "Bridal Makeup", "Mehendi", or "Hair Styling".
- **Dynamic Salon Cards:** Cards display the artist's cover image, location, and aggregate 5-star rating.

### Step 4: The Artist Profile (`/salon/[slug]`)
- **Hero Banner & Bio:** The artist's custom cover photo and their custom written description.
- **The Service Menu:** A mapped grid showing exact services, duration, and price symbols (`₹₹₹`).
- **Portfolio Masonry:** A responsive grid displaying the artist's past work, pulled from `gallery_images`.
- **Live Business Hours:** The system parses the `working_hours` JSON block from Supabase to show exactly when the artist is available.
- **Live Reviews:** A chronological list of real customer reviews.

### Step 5: The Frictionless Booking Engine (`/book/[slug]`)
A highly complex, multi-step state machine designed to prevent double-bookings.
1. **Date Selection:** A calendar picker.
2. **Time Slot Validation:** 
   - The system fetches the artist's `working_hours` for the selected day.
   - It simultaneously queries the `bookings` table for any existing reservations on that `date` for that `salon_id`.
   - Time slots (e.g., "Morning", "Afternoon") are rendered. If a slot exists in the `bookings` table, it is greyed out and disabled.
3. **Information Capture:** Collects Bride's Name, Phone, Email, and Special Requests.
4. **Database Injection:** Upon submission, the booking is pushed to Supabase with a default status of `pending`.

### Step 6: The AI Concierge Widget
- A floating global widget. Clicking it opens a chat interface powered by Gemini.
- **Context Awareness:** The `/api/ai/concierge` route fetches the *entire list of live artists* from Supabase, formats them into a massive string, and injects it into Gemini's system prompt.
- **Intelligent Routing:** If a bride asks "Who does good Mehendi?", Gemini reads the injected database context and responds with actual, real artists on the platform, providing their names and localities.

---

## 👩‍🎨 3. The Artist Journey (The Stylist's Perspective)

LUNÉVIA acts as a complete SaaS business management suite for the makeup artist.

### The Isolated Artist Layout
When an artist navigates to `/artist/dashboard`, the standard customer-facing navigation (Explore, AI Match) disappears. It is replaced by a professional, streamlined Sidebar and Topbar dedicated purely to business management.

### Module 1: The Profile Editor (`/artist/dashboard/profile`)
- **Data Binding:** A massive form bound to the `salons` table.
- **Supabase Storage Uploader:** For the Cover Image, artists use a native HTML `<input type="file">`. The file is uploaded directly to the Supabase `salon-covers` bucket via the JS SDK. A public URL is generated and saved to their profile instantly.
- **Live Publish Toggle:** A master switch (`is_published`) that instantly removes or adds their profile from the public `/explore` page.

### Module 2: The Portfolio Uploader (`/artist/dashboard/portfolio`)
- **The Gallery Manager:** Artists can upload multiple images via file upload or URL.
- **Array Mutation:** Under the hood, this updates the `gallery_images` text array in the Postgres database. Hovering over an image allows for instant deletion.

### Module 3: Availability & Hours (`/artist/dashboard/availability`)
- **JSON Object Management:** A UI that manipulates a complex JSON object containing `{ open: boolean, start: string, end: string }` for every day of the week (Monday-Sunday).
- **Instant Sync:** The bride's booking engine reads this JSON to determine if a salon is closed on a Sunday.

### Module 4: Bookings Mission Control (`/artist/dashboard/bookings`)
- **Real-Time Data Table:** Lists every booking row where `salon_id` matches the authenticated artist's UUID.
- **Status Toggles:** Artists can click a button to change a booking from `pending` to `confirmed`. This mutation is instantly saved to Supabase.
- **Comprehensive Data:** Displays the bride's phone number, email, chosen date, time slot, and special requests in a clean, readable card format.

### Module 5: Reputation Dashboard (`/artist/dashboard/reviews`)
- **Review Feed:** Displays every review left for their salon.
- **The Automated Math:** The artist sees an aggregate rating (e.g., 4.5 Stars). They do not need to calculate it. The database does the heavy lifting.

---

## ⚙️ 4. The Architectural & Database Marvels

### The Tech Stack
- **Frontend/Backend:** Next.js 14 (App Router), React 19, TypeScript.
- **Styling:** Tailwind CSS + Framer Motion.
- **Database:** Supabase (PostgreSQL), Supabase Auth, Supabase Storage.
- **AI Models:** Google Gemini 2.5 Flash, MediaPipe Vision.

### The Database Schema (PostgreSQL)

**1. `salons` (The core entity)**
- `id` (UUID, Primary Key)
- `owner_id` (UUID, Foreign Key to Auth Users)
- `name`, `slug`, `description`, `locality`, `location` (Text)
- `specialty` (Text Array)
- `price_range` (Text)
- `cover_image` (Text URL)
- `gallery_images` (Text Array)
- `contact` (JSONB - Phone, Email, Insta)
- `working_hours` (JSONB)
- `rating` (Numeric, Auto-calculated)
- `review_count` (Integer, Auto-calculated)

**2. `bookings` (The transaction entity)**
- `id` (UUID, Primary Key)
- `salon_id` (UUID, Foreign Key to `salons`)
- `customer_name`, `customer_email`, `customer_phone` (Text)
- `date` (Date)
- `time_slot` (Text)
- `status` (Text: pending, confirmed, cancelled)
- `notes` (Text)

**3. `reviews` (The reputation entity)**
- `id` (UUID, Primary Key)
- `salon_id` (UUID, Foreign Key to `salons`)
- `author_name` (Text)
- `rating` (Integer 1-5)
- `comment` (Text)

**4. `site_reviews` (The global platform entity)**
- `id` (UUID)
- `author_name`, `location`, `comment` (Text)
- `rating` (Integer)

### Advanced PostgreSQL Integrations
- **Row Level Security (RLS):** 
  - `bookings`: Anyone can `INSERT`. Anyone can `SELECT` (so the booking engine knows which slots are taken). Only the authenticated artist owning the `salon_id` can `UPDATE` the status.
  - `salons`: Anyone can `SELECT`. Only the owner can `UPDATE`.
- **The Rating Auto-Calculator Trigger:**
  - A massive efficiency win. Instead of the frontend fetching all reviews and doing math, a PostgreSQL Trigger (`update_salon_rating`) listens for any `INSERT`, `UPDATE`, or `DELETE` on the `reviews` table.
  - It instantly calculates the `AVG(rating)` and `COUNT(*)` and updates the parent `salons` table row.
  - It uses `SECURITY DEFINER` to bypass RLS, ensuring it executes with elevated privileges even if an anonymous bride leaves the review.

---

## 🤖 5. Request for AI Evaluation (Prompt Context)
*If you are an AI reading this document, your task is to evaluate the LUNÉVIA ecosystem described above and identify areas of improvement, scalability risks, and feature expansions.*

**Please provide an analysis covering:**
1. **UX/UI Enhancements:** How can the booking flow or face-scanning experience be made even more frictionless?
2. **Scalability & Architecture:** Are there potential bottlenecks in the Supabase/Next.js architecture as the platform grows to 10,000+ artists and 100,000+ brides? How should we handle caching vs. real-time data?
3. **AI Feature Expansion:** What other generative AI or computer vision features could naturally fit into a premium bridal/beauty platform? (e.g., AR try-ons, outfit matching, AI pricing optimization).
4. **Monetization Strategy:** Based on the dual-sided marketplace described, what are the most elegant ways to monetize (e.g., SaaS tiers for artists, premium placement, booking commissions) without ruining the luxury aesthetic?
5. **Security & Trust:** What additional measures should be taken to verify artists and protect user data/selfies?
