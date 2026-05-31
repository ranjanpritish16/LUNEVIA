export type BudgetRange =
  | "under-15000"
  | "15000-30000"
  | "30000-60000"
  | "60000-plus";

export type Service =
  | "bridal-makeup"
  | "pre-bridal-facials"
  | "hair-styling"
  | "mehendi"
  | "engagement-makeup"
  | "family-makeup"
  | "nail-art"
  | "draping";

export type Aesthetic =
  | "soft-dewy"
  | "glamorous-bold"
  | "natural-minimal"
  | "traditional-regal";

export type SkinTone =
  | "fair"
  | "light"
  | "medium"
  | "olive"
  | "deep"
  | "dark";

export interface PackageBuilderAnswers {
  weddingDate: string; // ISO date string
  budgetRange: BudgetRange;
  services: Service[];
  aesthetic: Aesthetic;
  skinTone: SkinTone;
  specialNotes?: string;
}

export interface TimelineItem {
  weeksBeforeWedding: number;
  task: string;
  priority: "high" | "medium";
}

export interface ServiceItem {
  name: string;
  description: string;
  estimatedCost: string;
}

export interface BridalPackage {
  packageName: string;
  tagline: string;
  totalEstimate: string;
  timeline: TimelineItem[];
  services: ServiceItem[];
  topArtistMatch: string;
  personalNote: string;
}

export interface PackageApiResponse {
  packageName: string;
  tagline: string;
  totalEstimate: string;
  timeline: TimelineItem[];
  services: ServiceItem[];
  topArtistMatch: string;
  personalNote: string;
}
