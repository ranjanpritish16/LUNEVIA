import type { PriceRange } from "@/components/ui/SalonCard";

export interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

export interface SalonService {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
}

export interface SalonReview {
  id: string;
  author: string;
  initials: string;
  date: string;
  rating: number;
  text: string;
  verifiedBooking: boolean;
}

export interface Salon {
  id: string;
  name: string;
  slug: string;
  location: string;
  locationArea: string;
  specialty: string[];
  rating: number;
  reviewCount: number;
  priceRange: PriceRange;
  coverImage: string;
  verified: boolean;
  bio: string[];
  team: TeamMember[];
  portfolio: string[];
  services: SalonService[];
  reviews: SalonReview[];
  aiSummary: string;
}

export { LOCATION_FILTERS, SPECIALTY_FILTERS } from "@/lib/data/filters";

export const PORTFOLIO_IMAGES = [
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
  "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=400",
  "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400",
  "https://images.unsplash.com/photo-1470259078422-826894b933aa?w=400",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
] as const;

const DEFAULT_SERVICES: SalonService[] = [
  {
    id: "trial",
    name: "Bridal Makeup Trial",
    price: "₹4,500",
    duration: "2 hrs",
    description:
      "A full trial session to perfect your bridal look before the big day.",
  },
  {
    id: "full-bridal",
    name: "Full Bridal Makeup",
    price: "₹18,000",
    duration: "5 hrs",
    description:
      "Complete bridal makeup with premium products and long-wear finish.",
  },
  {
    id: "pre-bridal",
    name: "Pre-Bridal Package (4 sessions)",
    price: "₹12,000",
    duration: "ongoing",
    description:
      "Four curated sessions covering skincare, hair, and makeup prep.",
  },
  {
    id: "engagement",
    name: "Engagement Makeup",
    price: "₹8,000",
    duration: "3 hrs",
    description:
      "Camera-ready glam for your engagement ceremony and celebrations.",
  },
  {
    id: "mehendi",
    name: "Mehendi (Full hands+feet)",
    price: "₹6,500",
    duration: "4 hrs",
    description:
      "Traditional and contemporary mehendi designs for hands and feet.",
  },
];

function createReviews(studioName: string): SalonReview[] {
  return [
    {
      id: "1",
      author: "Priya Sharma",
      initials: "PS",
      date: "January 2026",
      rating: 5,
      text: `${studioName} understood exactly what I wanted for my wedding. The trial was thorough and the final look was flawless.`,
      verifiedBooking: true,
    },
    {
      id: "2",
      author: "Ankita Mehra",
      initials: "AM",
      date: "November 2025",
      rating: 5,
      text: "Professional, warm, and incredibly talented. My makeup lasted through a 12-hour wedding day.",
      verifiedBooking: true,
    },
    {
      id: "3",
      author: "Simran Kaur",
      initials: "SK",
      date: "September 2025",
      rating: 4,
      text: "Beautiful work on my mehendi and bridal makeup. Would recommend booking a trial early.",
      verifiedBooking: true,
    },
    {
      id: "4",
      author: "Rhea Kapoor",
      initials: "RK",
      date: "August 2025",
      rating: 5,
      text: "The team made me feel like royalty. Every detail was considered — from skin prep to the final touch-ups.",
      verifiedBooking: true,
    },
  ];
}

export const salons: Salon[] = [
  {
    id: "1",
    name: "Neha Kapoor Bridal Studio",
    slug: "neha-kapoor",
    location: "Lajpat Nagar, Delhi",
    locationArea: "Lajpat Nagar",
    specialty: ["Bridal Makeup", "Airbrush"],
    rating: 4.9,
    reviewCount: 214,
    priceRange: "₹₹₹",
    coverImage:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600",
    verified: true,
    bio: [
      "Neha Kapoor Bridal Studio has been Delhi's trusted name in luxury bridal makeup for over a decade. Specialising in HD and airbrush techniques, Neha and her team create looks that photograph beautifully and feel effortlessly natural.",
      "From intimate ceremonies to grand ballroom receptions, every bride receives a personalised consultation, premium product selection, and on-the-day touch-up support — because your most beautiful day deserves nothing less.",
    ],
    team: [
      { name: "Neha Kapoor", role: "Lead Bridal Artist", initials: "NK" },
      { name: "Divya Mehta", role: "Senior Makeup Artist", initials: "DM" },
      { name: "Kavya Singh", role: "Hair Stylist", initials: "KS" },
    ],
    portfolio: [...PORTFOLIO_IMAGES],
    services: DEFAULT_SERVICES,
    reviews: createReviews("Neha Kapoor Bridal Studio"),
    aiSummary:
      "Brides consistently praise her ability to enhance natural features without overdoing it. Bridal trials are highly recommended.",
  },
  {
    id: "2",
    name: "Anjali Beauty Lounge",
    slug: "anjali-beauty",
    location: "Hauz Khas, Delhi",
    locationArea: "Hauz Khas",
    specialty: ["Mehendi", "Bridal Makeup"],
    rating: 4.7,
    reviewCount: 189,
    priceRange: "₹₹",
    coverImage:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600",
    verified: true,
    bio: [
      "Anjali Beauty Lounge blends traditional mehendi artistry with contemporary bridal makeup in the heart of Hauz Khas. Known for intricate Rajasthani-inspired designs and soft, romantic makeup palettes.",
      "The lounge offers a serene, boutique experience where brides can explore mehendi styles, makeup trials, and pre-wedding packages under one roof — all tailored to Delhi wedding traditions.",
    ],
    team: [
      { name: "Anjali Verma", role: "Founder & Mehendi Artist", initials: "AV" },
      { name: "Pooja Rastogi", role: "Bridal Makeup Artist", initials: "PR" },
    ],
    portfolio: [...PORTFOLIO_IMAGES],
    services: DEFAULT_SERVICES,
    reviews: createReviews("Anjali Beauty Lounge"),
    aiSummary:
      "Clients love the fusion of traditional mehendi and modern bridal glam. Book early for peak wedding season.",
  },
  {
    id: "3",
    name: "Studio Elara",
    slug: "studio-elara",
    location: "South Extension, Delhi",
    locationArea: "South Extension",
    specialty: ["Pre-Bridal", "Hair Styling"],
    rating: 4.8,
    reviewCount: 156,
    priceRange: "₹₹₹",
    coverImage:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600",
    verified: true,
    bio: [
      "Studio Elara is a premium pre-bridal and hair styling destination in South Extension. Their holistic approach covers skincare, hair treatments, and ceremony-ready styling across your entire wedding journey.",
      "With a minimalist, luxury studio aesthetic and internationally trained stylists, Elara is the choice for brides who want editorial-quality hair and a complete pre-wedding wellness experience.",
    ],
    team: [
      { name: "Elara Khanna", role: "Creative Director", initials: "EK" },
      { name: "Megha Joshi", role: "Hair Stylist", initials: "MJ" },
      { name: "Tara Bhatia", role: "Pre-Bridal Specialist", initials: "TB" },
    ],
    portfolio: [...PORTFOLIO_IMAGES],
    services: DEFAULT_SERVICES,
    reviews: createReviews("Studio Elara"),
    aiSummary:
      "Highly rated for pre-bridal packages and editorial hair styling. Ideal for brides prioritising hair health before the wedding.",
  },
  {
    id: "4",
    name: "The Bridal Room",
    slug: "the-bridal-room",
    location: "Vasant Kunj, Delhi",
    locationArea: "Vasant Kunj",
    specialty: ["Full Bridal Package"],
    rating: 4.6,
    reviewCount: 98,
    priceRange: "₹₹",
    coverImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    verified: false,
    bio: [
      "The Bridal Room offers end-to-end bridal packages in Vasant Kunj — makeup, hair, draping, and on-the-day coordination in one seamless experience. Perfect for brides who want simplicity without compromising on quality.",
      "Their package-first approach means transparent pricing, dedicated bridal suites, and a coordinated team that stays with you from getting-ready through the pheras.",
    ],
    team: [
      { name: "Shreya Malhotra", role: "Package Coordinator", initials: "SM" },
      { name: "Nisha Arora", role: "Bridal Artist", initials: "NA" },
    ],
    portfolio: [...PORTFOLIO_IMAGES],
    services: DEFAULT_SERVICES,
    reviews: createReviews("The Bridal Room"),
    aiSummary:
      "Brides appreciate the all-in-one package convenience and friendly team. Great value for full bridal coordination.",
  },
  {
    id: "5",
    name: "Meera Makeover Studio",
    slug: "meera-makeover",
    location: "Greater Kailash, Delhi",
    locationArea: "Greater Kailash",
    specialty: ["Bridal Makeup", "HD Makeup"],
    rating: 4.8,
    reviewCount: 201,
    priceRange: "₹₹₹",
    coverImage:
      "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600",
    verified: true,
    bio: [
      "Meera Makeover Studio in Greater Kailash is renowned for HD makeup that looks flawless in daylight and under harsh venue lighting. Meera's signature dewy, luminous finish has made her a favourite among South Delhi brides.",
      "The studio invests in the latest camera-ready techniques and premium international brands, ensuring your look stays fresh from the morning pheras to the last dance.",
    ],
    team: [
      { name: "Meera Saxena", role: "Lead HD Artist", initials: "MS" },
      { name: "Ishita Rao", role: "Makeup Artist", initials: "IR" },
      { name: "Aditi Nair", role: "Assistant Artist", initials: "AN" },
    ],
    portfolio: [...PORTFOLIO_IMAGES],
    services: DEFAULT_SERVICES,
    reviews: createReviews("Meera Makeover Studio"),
    aiSummary:
      "HD makeup expertise is the standout — brides rave about how natural yet polished they look in photos and video.",
  },
  {
    id: "6",
    name: "Riya's Bridal Art",
    slug: "riyas-bridal-art",
    location: "Saket, Delhi",
    locationArea: "Saket",
    specialty: ["Mehendi", "Pre-Bridal"],
    rating: 4.5,
    reviewCount: 134,
    priceRange: "₹₹",
    coverImage:
      "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=600",
    verified: false,
    bio: [
      "Riya's Bridal Art in Saket specialises in bespoke mehendi designs and thoughtful pre-bridal care. Riya brings an artist's eye to every motif, from minimalist Arabic patterns to elaborate bridal full-hand designs.",
      "Her pre-bridal sessions focus on skin brightening, hair conditioning, and mehendi stain optimisation — so your hands look picture-perfect when the henna is applied.",
    ],
    team: [
      { name: "Riya Choudhary", role: "Mehendi Artist", initials: "RC" },
      { name: "Sana Ali", role: "Pre-Bridal Consultant", initials: "SA" },
    ],
    portfolio: [...PORTFOLIO_IMAGES],
    services: DEFAULT_SERVICES,
    reviews: createReviews("Riya's Bridal Art"),
    aiSummary:
      "Mehendi artistry receives consistent praise. Pre-bridal sessions pair well with her signature stain-rich henna blends.",
  },
  {
    id: "7",
    name: "Glamour Studio Delhi",
    slug: "glamour-studio-delhi",
    location: "South Ex, Delhi",
    locationArea: "South Extension",
    specialty: ["Hair Styling", "Bridal Makeup"],
    rating: 4.7,
    reviewCount: 167,
    priceRange: "₹₹",
    coverImage:
      "https://images.unsplash.com/photo-1470259078422-826894b933aa?w=600",
    verified: true,
    bio: [
      "Glamour Studio Delhi brings runway-inspired hair and classic bridal makeup to South Extension. Their stylists excel at voluminous buns, soft waves, and makeup that complements your hairstyle vision.",
      "Whether you're planning a sangeet blowout or a traditional braided bun for the wedding, Glamour Studio delivers polished, long-lasting styles with premium products.",
    ],
    team: [
      { name: "Karishma Sethi", role: "Hair Director", initials: "KS" },
      { name: "Nidhi Chopra", role: "Bridal Makeup Artist", initials: "NC" },
    ],
    portfolio: [...PORTFOLIO_IMAGES],
    services: DEFAULT_SERVICES,
    reviews: createReviews("Glamour Studio Delhi"),
    aiSummary:
      "Hair styling is the hero here — brides love the volume and longevity. Makeup pairs beautifully with their signature updos.",
  },
  {
    id: "8",
    name: "Zara Bridal Collective",
    slug: "zara-bridal-collective",
    location: "Hauz Khas, Delhi",
    locationArea: "Hauz Khas",
    specialty: ["Full Bridal Package", "Airbrush"],
    rating: 4.9,
    reviewCount: 88,
    priceRange: "₹₹₹",
    coverImage:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600",
    verified: true,
    bio: [
      "Zara Bridal Collective is an exclusive Hauz Khas studio offering luxury full bridal packages with airbrush perfection. Their collective of top artists collaborates on each bride for a cohesive, high-fashion look.",
      "From the first consultation to the final veil placement, Zara's team handles makeup, hair, draping, and accessory styling — creating a red-carpet-ready bride for Delhi's most discerning clients.",
    ],
    team: [
      { name: "Zara Khan", role: "Creative Lead", initials: "ZK" },
      { name: "Fatima Sheikh", role: "Airbrush Specialist", initials: "FS" },
      { name: "Leena Das", role: "Hair & Draping", initials: "LD" },
    ],
    portfolio: [...PORTFOLIO_IMAGES],
    services: DEFAULT_SERVICES,
    reviews: createReviews("Zara Bridal Collective"),
    aiSummary:
      "Luxury airbrush finish and full-package coordination earn top marks. Book well in advance — limited bridal slots per season.",
  },
];

export function getAllSalons(): Salon[] {
  return salons;
}

export function getSalonBySlug(slug: string): Salon | undefined {
  return salons.find((salon) => salon.slug === slug);
}

export function getAllSalonSlugs(): string[] {
  return salons.map((salon) => salon.slug);
}

export function getSalonContextForConcierge() {
  return salons.map(
    ({
      id,
      name,
      slug,
      location,
      locationArea,
      specialty,
      rating,
      reviewCount,
      priceRange,
      verified,
      aiSummary,
    }) => ({
      id,
      name,
      slug,
      location,
      locationArea,
      specialty,
      rating,
      reviewCount,
      priceRange,
      verified,
      aiSummary,
    })
  );
}

export function getSalonSlugById(id: string): string | undefined {
  return salons.find((salon) => salon.id === id)?.slug;
}
