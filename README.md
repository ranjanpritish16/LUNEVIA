# LUNEVIA - AI-Powered Bridal Hairstyle Recommendation App

LUNEVIA is an intelligent web application that analyzes users' face shapes using AI and recommends personalized bridal hairstyles. The app uses client-side facial landmark detection with MediaPipe and Google's Generative AI (Gemini) to provide accurate, tailored styling advice.

## 🎯 Project Overview

LUNEVIA helps users discover the perfect bridal hairstyle by:
1. **Uploading a selfie** - Users upload a clear photo of their face
2. **AI Face Analysis** - Client-side MediaPipe detects 468 facial landmarks and extracts precise measurements
3. **Shape Classification** - Google Gemini AI analyzes measurements to classify face shape (Oval, Round, Square, Heart, Diamond, Rectangle, Triangle, Inverted Triangle)
4. **Personalized Recommendations** - Gemini generates 3 bridal hairstyles tailored to the detected face shape

## 📱 Key Features

- **Privacy-First Design**: Face analysis happens entirely client-side; images are never sent to servers
- **8 Face Shape Classification**: Supports Oval, Round, Square, Heart, Diamond, Rectangle, Triangle (Pear), and Inverted Triangle
- **AI-Powered Recommendations**: Gemini generates contextual hairstyle suggestions with explanations
- **Responsive UI**: Beautiful, modern interface built with React, Tailwind CSS, and Framer Motion
- **Real-time Analysis**: Instant face detection and measurement extraction

## 🎨 Pages & Features Overview

### 1. **Home Page** (`/`)
The landing page introducing LUNEVIA with:
- **Hero Section**: Stunning banner with call-to-action
- **How It Works**: Step-by-step explanation of the face analysis process
- **Featured Artists Section**: Showcase of top bridal stylists and artists
- **Stats Bar**: Display of platform statistics (users, recommendations, etc.)
- **Testimonials Section**: Real user reviews and success stories
- **Ornamental Dividers**: Beautiful design elements separating sections
- **Concierge Banner**: Promotion of AI assistant features

### 2. **AI Match / Hairstyle Analyzer** (`/hairstyle`)
The core feature of LUNEVIA:
- **Face Photo Upload**: Accept JPG, PNG, WebP formats
- **Real-time Face Detection**: MediaPipe analyzes 468 facial landmarks
- **Measurement Extraction**: Calculates face length, jaw width, forehead width, cheekbone width
- **AI Classification**: Gemini classifies face shape (8 types)
- **Hairstyle Recommendations**: 3 personalized bridal hairstyles with:
  - Style name
  - Detailed description
  - Why it works for the detected face shape
  - Best occasions to wear it
- **Debug Information**: Toggle to view extracted measurements for transparency
- **Confidence Indicator**: Shows classification confidence level (High/Medium/Low)

**Key Components:**
- `HairstyleAnalyzer.tsx`: Main UI component
- `lib/faceMesh.ts`: Face detection engine
- `/api/ai/hairstyle`: Backend recommendation API

### 3. **Explore Page** (`/explore`)
Browse and discover bridal hairstyles:
- **Hairstyle Gallery**: Browse all available hairstyle recommendations
- **Filter Options**: Filter by:
  - Face shape (Oval, Round, Square, etc.)
  - Occasion (Day wedding, Evening reception, etc.)
  - Style type
  - Complexity level
- **Salon Finder**: Discover salons specializing in each style
- **Detailed Style Pages**: View hairstyle details, requirements, and similar styles
- **Recommendation Cards**: Beautiful cards showing hairstyle images and descriptions

**Component:** `ExplorePage.tsx`

### 4. **LUNEVIA Concierge AI** (Global Widget + `/concierge`)
Intelligent AI assistant available throughout the app:
- **Chat Interface**: Ask questions about hairstyles, face shapes, and weddings
- **Styling Tips**: Get personalized styling advice
- **FAQs**: Common questions answered by AI
- **Booking Assistance**: Help finding and booking stylists
- **Real-time Responses**: Powered by Google Gemini
- **Context-Aware**: Remembers your face shape and preferences

**Features:**
- Always available widget in bottom corner
- Full-page chat interface for detailed consultations
- Typing indicators and loading states
- Message history within session
- Smooth animations with Framer Motion

**Component:** `ConciergeWidget.tsx`  
**API:** `/api/ai/concierge`

### 5. **Artist/Salon Directory** (`/explore` - detailed view)
Discover professional bridal stylists:
- **Artist Profiles**: View artist bios, specialties, and portfolios
- **Salon Listings**: Browse all partner salons
- **Ratings & Reviews**: Community ratings and reviews
- **Specializations**: Filter by expertise (updos, curls, straight styles, etc.)
- **Experience Level**: View years of experience and certifications
- **Service Offerings**: Bridal consultations, trial runs, on-location services

**Component:** `FeaturedArtistsSection.tsx`  
**Data:** `lib/data/salons.ts`

### 6. **Salon Detail Page** (`/salon/[slug]`)
Comprehensive salon information:
- **Salon Overview**: Name, location, contact information
- **Services Menu**: All offered services with pricing
- **Artists**: List of stylists available at the salon
- **Portfolio**: Photo gallery of previous work
- **Customer Reviews**: Ratings and testimonials
- **Booking Button**: Direct link to book appointments
- **Business Hours**: Operating hours and availability
- **Contact Info**: Phone, email, website links

**Component:** `SalonDetailPage.tsx`  
**Data Source:** `lib/data/salons.ts`

### 7. **Booking Page** (`/book/[slug]`)
Complete booking management system:
- **Booking Flow**: Step-by-step booking process
- **Service Selection**: Choose hairstyle or package
- **Date/Time Selection**: Pick available booking slots
- **Stylist Selection**: Choose preferred artist
- **Trial Run Options**: Schedule pre-wedding trial
- **Special Requirements**: Add notes and preferences
- **Payment Integration**: Secure booking confirmation
- **Booking Confirmation**: Confirmation details and calendar invite

**Component:** `BookingFlow.tsx`

### 8. **Navigation & Layout**
- **Navbar**: Top navigation with:
  - Logo and branding
  - Main navigation links (Explore, AI Match, How it Works)
  - Booking button
  - User menu
  
- **Footer**: 
  - Quick links
  - Contact information
  - Social media links
  - Newsletter signup
  - Privacy and terms links

**Components:** `Navbar.tsx`, `Footer.tsx`

### 9. **UI Components Library**
Reusable components used throughout:
- **LuneviaButton**: Custom styled buttons with hover effects
- **Badge**: Labels for face shapes, occasions, and tags
- **SalonCard**: Card component for salon listings
- **PageWrapper**: Consistent page layout wrapper

## � User Journey & Workflows

### Typical User Flow:

1. **Discovery** → User lands on home page (`/`)
2. **Learning** → Views "How It Works" section with step-by-step guide
3. **Consultation** → Optional: Chats with LUNEVIA Concierge for questions
4. **Face Analysis** → Navigates to `/hairstyle` and uploads photo
5. **Results** → Sees AI-detected face shape and 3 hairstyle recommendations
6. **Exploration** → Visits `/explore` to see more styles and artists
7. **Artist Discovery** → Browses salon and artist profiles
8. **Booking** → Selects a salon/artist and proceeds to `/book`
9. **Confirmation** → Completes booking with calendar invite

### Feature Integration Points:

- **Concierge AI**: Available on all pages as floating widget
- **Hairstyle Recommendations**: Links directly from analyzer to booking
- **Salon Discovery**: Featured artists section links to full salon profiles
- **Cross-Navigation**: Easy navigation between related features

## 🔗 Navigation Map

```
Home (/)
├── How It Works
├── Featured Artists (links to /salon/[slug])
├── Testimonials
└── CTA Buttons → /hairstyle

Hairstyle Analyzer (/hairstyle)
├── Upload Photo
├── Face Analysis Results
├── Recommendation Cards
└── "Book This Style" → /salon/[slug]

Explore (/explore)
├── Browse All Hairstyles
├── Filter by Face Shape, Occasion
├── Artist Directory
└── Salon Cards (links to /salon/[slug])

Salon Details (/salon/[slug])
├── Salon Info & Reviews
├── Artist Profiles
├── Portfolio Gallery
└── "Book Appointment" → /book/[slug]

Booking (/book/[slug])
├── Service Selection
├── Date/Time Selection
├── Stylist Selection
└── Confirmation

Concierge (Global)
├── Available on all pages
├── Floating widget
└── Full chat page (optional)
```
## 🎨 Design System & Styling

### Color Palette
- **Primary Gold**: `#D4AF37` - Luxurious bridal theme
- **Primary Charcoal**: `#1A1A1A` - Professional, elegant text
- **Blush Rose**: `#FFF0F5` - Soft, feminine accents
- **White**: `#FFFFFF` - Clean backgrounds
- **Warm Shadows**: Soft drop shadows for depth

### Typography
- **Headings**: Cormorant (serif) - Elegant, luxurious feel
- **Body**: DM Sans (sans-serif) - Clean, modern, readable
- **Font Sizes**: Responsive scaling from mobile to desktop

### Components Styling
- **Buttons**: 
  - Gold background with hover animations
  - Smooth transitions (400ms)
  - Disabled states for better UX
  
- **Cards**:
  - Soft shadows (warm drop shadows)
  - Border: 1px solid gold/20
  - Rounded corners (rounded-2xl)
  
- **Inputs**:
  - Clean borders with focus states
  - Placeholder text in lighter color
  - Smooth transitions

### Animations
- **Framer Motion** used throughout:
  - Page transitions (fade-in-up)
  - Card hovers and clicks
  - Loading spinners
  - Modal animations
  - Recommendation cards stagger animation

### Responsive Design
- **Mobile-First**: Optimized for mobile screens first
- **Breakpoints**: 
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- **Touch-Friendly**: Large buttons and tap targets on mobile
## �🛠️ Tech Stack

- **Frontend**: Next.js 14.2.35, React 19, TypeScript, Tailwind CSS
- **AI/ML**: 
  - MediaPipe Tasks Vision (v0.10.5) - Client-side face detection
  - Google Generative AI SDK (v0.24.1) - Gemini API for classification and recommendations
- **Animations**: Framer Motion
- **Image Processing**: HTML5 Canvas

## 📁 Project Structure

```
Lunevia/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── concierge/
│   │   │   │   └── route.ts         # Concierge AI endpoint
│   │   │   ├── hairstyle/
│   │   │   │   └── route.ts         # Hairstyle recommendation API
│   │   │   └── models/
│   │   │       └── route.ts         # Available Gemini models discovery
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Home page
│   │   └── not-found.tsx
│   ├── book/[slug]/page.tsx         # Booking details
│   ├── explore/page.tsx             # Explore page
│   ├── hairstyle/page.tsx           # Hairstyle analyzer page
│   └── salon/[slug]/page.tsx        # Salon details
├── components/
│   ├── ai/
│   │   └── ConciergeWidget.tsx      # AI concierge chatbot
│   ├── hairstyle/
│   │   └── HairstyleAnalyzer.tsx    # Main face analysis component
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedArtistsSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── ConciergeBanner.tsx
│   │   ├── StatsBar.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── OrnamentalDivider.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── Badge.tsx
│   │   ├── LuneviaButton.tsx
│   │   ├── PageWrapper.tsx
│   │   └── SalonCard.tsx
│   └── providers/
│       └── ClientShell.tsx
├── lib/
│   ├── gemini.ts                    # Gemini API initialization
│   ├── faceMesh.ts                  # MediaPipe face analysis engine
│   ├── openai.ts                    # OpenAI client (future use)
│   ├── utils.ts                     # Utility functions
│   ├── data/
│   │   ├── filters.ts               # Filter options
│   │   └── salons.ts                # Salon database
│   └── types/
│       ├── concierge.ts             # Concierge types
│       └── hairstyle.ts             # Hairstyle types
├── hooks/
│   └── useScrollY.ts                # Scroll position hook
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── next.config.mjs
```

## 🔧 Technical Details

### Face Shape Detection (`lib/faceMesh.ts`)

The app uses MediaPipe to extract 468 facial landmarks and calculate these measurements:
- **Face Length**: Distance from forehead to chin
- **Jaw Width**: Left to right jaw angle distance
- **Forehead Width**: Temple to temple distance
- **Cheekbone Width**: Left to right cheekbone distance

These measurements are converted to ratios and sent to Gemini for intelligent classification.

### Hairstyle Recommendation Flow

1. **User uploads photo** → Component: `HairstyleAnalyzer.tsx`
2. **MediaPipe analyzes face** → Function: `analyzeFaceShape(image)`
3. **Measurements extracted** → Type: `FaceMeasurements`
4. **Sent to API endpoint** → Route: `/api/ai/hairstyle`
5. **Gemini classifies and recommends** → Model: `gemini-2.5-flash`
6. **Results displayed to user** → UI with animated recommendations

## 🚀 Installation & Setup

### Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+
- **Git**: For version control
- **Google Gemini API Key**: Required for AI features

### Step 1: Clone the Repository

```bash
git clone https://github.com/ranjanpritish16/LUNEVIA.git
cd LUNEVIA
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Next.js 14
- React 19
- MediaPipe Tasks Vision
- Google Generative AI SDK
- Tailwind CSS
- Framer Motion

### Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Google Gemini API credentials:

```env
# Google Generative AI Configuration
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.5-flash
GEMINI_API_VERSION=v1beta
```

**Where to get your Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click on "Get API Key" in the left sidebar
3. Create a new API key for a new project
4. Copy the API key and paste it in `.env.local`

### Step 4: Run the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Step 5: Access the App

- **Home Page**: http://localhost:3000
- **Hairstyle Analyzer**: http://localhost:3000/hairstyle
- **Explore**: http://localhost:3000/explore

## 📖 Usage Guide

### Using the Hairstyle Analyzer

1. Navigate to `/hairstyle` page
2. Click **"Upload your photo"** button
3. Select a clear, front-facing selfie (JPG, PNG, or WebP)
4. Click **"Analyze My Face Shape"** button
5. Wait for analysis (usually < 3 seconds)
6. View detected face shape and 3 personalized hairstyle recommendations

**Tips for Best Results:**
- Use clear, well-lit photos
- Face should be front-facing
- Image should be at least 200x200 pixels
- No filters or heavy makeup recommended

### Debug Information

The app displays extracted facial measurements for debugging:
- Face Length (pixels)
- Jaw Width (pixels)
- Forehead Width (pixels)
- Cheekbone Width (pixels)
- All measurement ratios

## 🔐 Privacy & Security

- ✅ **No image storage**: Photos are processed client-side and never saved
- ✅ **No server transmission**: Images stay in your browser
- ✅ **Secure API**: Only facial measurements sent to Gemini, not images
- ✅ **Optional cookies**: Uses browser session storage only

## 🐛 Troubleshooting

### Issue: "GEMINI_API_KEY is not configured"

**Solution**: 
1. Create `.env.local` file
2. Add valid `GEMINI_API_KEY`
3. Restart dev server with `npm run dev`

### Issue: "Model not found" error (503)

**Solution**: 
1. Verify API key is correct
2. Check if Gemini API is available (may have rate limits)
3. Wait 1-2 minutes and retry
4. Ensure `GEMINI_API_VERSION=v1beta` is set

### Issue: Face not detected

**Solution**:
1. Ensure face is clearly visible and centered
2. Try better lighting conditions
3. Remove hats, glasses, or heavy accessories
4. Take a front-facing photo (not angled)

### Issue: "Cannot read property 'naturalWidth'"

**Solution**: 
1. This is fixed in latest build
2. Update to latest code from git
3. Clear browser cache and restart

## 📦 Build for Production

```bash
npm run build
```

Start production server:

```bash
npm start
```

## 🧪 Testing

Run linting:

```bash
npm run lint
```

## 📝 API Endpoints

### POST `/api/ai/hairstyle`

Analyzes facial measurements and returns hairstyle recommendations.

**Request Body:**
```json
{
  "measurements": {
    "faceLength": 220,
    "jawWidth": 140,
    "foreheadWidth": 150,
    "cheekboneWidth": 160,
    "lengthToWidthRatio": 1.57,
    "jawToForeheadRatio": 0.93,
    "cheekboneToJawRatio": 1.14
  }
}
```

**Response:**
```json
{
  "faceShape": "Oval",
  "confidence": "High",
  "characteristics": "Your face shape is Oval...",
  "recommendations": [
    {
      "style": "Half-Up, Half-Down",
      "description": "...",
      "whyItWorks": "...",
      "bestFor": "Day wedding"
    }
  ]
}
```

### GET `/api/ai/models`

Lists available Gemini models for discovery.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📄 License

This project is open source and available under the MIT License.

## 📧 Support

For questions or issues, please create an issue on GitHub or contact the development team.

## 🎨 Design Philosophy

LUNEVIA is designed with a focus on:
- **Elegance**: Clean, luxurious UI inspired by bridal aesthetics
- **Accessibility**: Easy-to-use interface for all users
- **Privacy**: Client-side processing for user data protection
- **Accuracy**: AI-powered analysis for personalized recommendations

## 🚀 Future Enhancements

- [ ] Virtual try-on with AR
- [ ] Hairstyle gallery with pin functionality
- [ ] Booking integration with salons
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Advanced styling tips per face shape
- [ ] Makeup recommendations

## 📞 Contact

**Project**: LUNEVIA - AI Bridal Hairstyle Assistant  
**Repository**: https://github.com/ranjanpritish16/LUNEVIA  
**Version**: 1.0.0  
**Last Updated**: May 2026

---

**Happy Styling! 💇‍♀️✨**
