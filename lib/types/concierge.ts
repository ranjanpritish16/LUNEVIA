export interface ConciergeRecommendation {
  salonId: string;
  salonName: string;
  slug: string;
  matchScore: number;
  reasoning: string;
  specialNote: string;
}

export interface ConciergeApiResponse {
  message: string;
  recommendations: ConciergeRecommendation[];
}
