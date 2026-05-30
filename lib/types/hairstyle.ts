export interface HairstyleRecommendation {
  style: string;
  description: string;
  whyItWorks: string;
  bestFor: string;
}

export interface HairstyleApiResponse {
  faceShape: string;
  confidence: string;
  characteristics: string;
  recommendations: HairstyleRecommendation[];
}
