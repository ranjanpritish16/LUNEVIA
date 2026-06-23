import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getGeminiModel } from "@/lib/gemini";
import type {
  ConciergeApiResponse,
  ConciergeRecommendation,
} from "@/lib/types/concierge";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ConciergeRequestBody {
  messages: ChatMessage[];
}

interface RawRecommendation {
  salonId?: string;
  salonName?: string;
  matchScore?: number;
  reasoning?: string;
  specialNote?: string;
}

interface RawConciergeResponse {
  type?: "recommendations" | "text";
  message?: string;
  recommendations?: RawRecommendation[];
  salons?: RawRecommendation[];
}

function buildSystemPrompt(salonJson: string): string {
  return `You are LUNÉVIA Concierge — a warm, knowledgeable luxury bridal beauty consultant for Delhi weddings. You speak like a trusted friend who happens to know every great makeup artist in the city.

You have access to this curated list of verified salons from our database: ${salonJson}.

RESPONSE RULES — follow strictly:

1. When the bride is asking for salon/artist recommendations (keywords: find, recommend, best, who does, looking for, budget, location, complexion, makeup, hair, mehendi, airbrush, etc.):
   Return ONLY this JSON:
   {
     "type": "recommendations",
     "message": "warm personalised 1-2 sentence intro referencing her specific requirements",
     "salons": [
       {
         "salonId": "exact id from database",
         "name": "exact name from database",
         "matchScore": 88,
         "reasoning": "2 warm specific sentences referencing HER budget/location/complexion",
         "specialNote": "1 insider tip only this artist's clients know"
       }
     ]
   }
   Recommend 1–3 salons. Only use salons from the database with their exact id and name. DO NOT make up salons.

2. For general questions (planning advice, what to expect, timeline questions, etc.):
   Return ONLY this JSON:
   {
     "type": "text",
     "message": "your warm helpful conversational response, 2-4 sentences max"
   }

3. For greetings or when you need more info to recommend:
   Return ONLY this JSON:
   {
     "type": "text",
     "message": "warm greeting or clarifying question to understand her needs better"
   }

PERSONALITY: Warm, specific, confident. Never generic. Always use the bride's exact details (budget, complexion, location, style) in your reasoning. Address her directly. Keep responses concise — this is a chat, not an essay.

Respond in the same language the user writes in (Hindi or English).`;
}

function enrichRecommendations(
  raw: RawRecommendation[],
  dbSalons: any[]
): ConciergeRecommendation[] {
  return raw.slice(0, 3).map((rec) => {
    const salonId = rec.salonId ?? "";
    const dbSalon = dbSalons.find(s => s.id === salonId || s.name === rec.salonName);
    const slug = dbSalon?.slug ?? "";

    return {
      salonId: dbSalon?.id ?? salonId,
      salonName: dbSalon?.name ?? rec.salonName ?? "Recommended Artist",
      slug,
      matchScore: Math.min(99, Math.max(80, rec.matchScore ?? 90)),
      reasoning: rec.reasoning ?? "",
      specialNote: rec.specialNote ?? "",
    };
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ConciergeRequestBody;
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    // Fetch REAL salons from the database
    const { data: dbSalons } = await supabase
      .from("salons")
      .select("id, name, slug, location, locality, specialty, price_range, rating, review_count, verified");
      
    const activeSalons = dbSalons || [];

    // Build system prompt with REAL salon database
    const salonJson = JSON.stringify(activeSalons.map(s => ({
      id: s.id,
      name: s.name,
      location: s.location || s.locality,
      specialty: s.specialty,
      priceRange: s.price_range,
      rating: s.rating,
      reviewCount: s.review_count
    })));
    
    const systemPrompt = buildSystemPrompt(salonJson);

    // Build a single prompt string (compatible with v1 SDK)
    const conversationText = messages
      .map((m) => `${m.role === "assistant" ? "CONCIERGE" : "BRIDE"}: ${m.content}`)
      .join("\n\n");

    const fullPrompt = `${systemPrompt}\n\n--- CONVERSATION START ---\n\n${conversationText}\n\nCONCIERGE:`;

    // Try primary model
    const model = getGeminiModel();
    let result;
    try {
      result = await model.generateContent([{ text: fullPrompt }]);
    } catch (err: any) {
      console.error("[concierge] Model failed:", err);
      return NextResponse.json(
        { error: "LUNÉVIA Concierge is temporarily unavailable. Please try again in a moment." },
        { status: 503 }
      );
    }

    if (!result) {
      return NextResponse.json(
        { error: "LUNÉVIA Concierge is temporarily unavailable. Please try again in a moment." },
        { status: 503 }
      );
    }


    let content = result.response.text();
    if (!content) {
      return NextResponse.json(
        { error: "No response from LUNÉVIA Concierge" },
        { status: 500 }
      );
    }

    // Strip markdown formatting if the model returned any
    content = content.replace(/```json\n?|\n?```/g, "").trim();

    const parsed = JSON.parse(content) as RawConciergeResponse;

    // Handle both "recommendations" type and "text" type
    if (parsed.type === "recommendations" || parsed.recommendations || parsed.salons) {
      const rawSalons = parsed.salons ?? parsed.recommendations ?? [];
      const response: ConciergeApiResponse = {
        message:
          parsed.message ??
          "Here are my top picks for you:",
        recommendations: enrichRecommendations(rawSalons, activeSalons),
      };
      return NextResponse.json({ type: "recommendations", ...response });
    }

    // Text response
    return NextResponse.json({
      type: "text",
      message: parsed.message ?? "I'm here to help! Tell me more about your vision.",
    });
  } catch (error) {
    console.error("[concierge]", error);
    return NextResponse.json(
      { error: "LUNÉVIA Concierge is temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
