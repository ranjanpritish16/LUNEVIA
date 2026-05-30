import { NextResponse } from "next/server";

import {
  getAllSalons,
  getSalonContextForConcierge,
  getSalonSlugById,
} from "@/lib/data/salons";
import { getOpenAIClient } from "@/lib/openai";
import type {
  ConciergeApiResponse,
  ConciergeRecommendation,
} from "@/lib/types/concierge";

interface ConciergeRequestBody {
  userMessage?: string;
}

interface RawRecommendation {
  salonId?: string;
  salonName?: string;
  matchScore?: number;
  reasoning?: string;
  specialNote?: string;
}

interface RawConciergeResponse {
  message?: string;
  recommendations?: RawRecommendation[];
}

function buildSystemPrompt(salonJson: string): string {
  return `You are LUNÉVIA Concierge, a luxury bridal beauty consultant for Delhi weddings. You have access to this salon database: ${salonJson}. Based on the bride's message, recommend exactly 3 salons. Respond ONLY with valid JSON in this format:
{
  "message": "string (warm 1-sentence intro)",
  "recommendations": [
    {
      "salonId": "string",
      "salonName": "string",
      "matchScore": 85-99,
      "reasoning": "string (2 sentences, specific and warm)",
      "specialNote": "string (1 sentence tip)"
    }
  ]
}

Always be warm, confident, and specific. Never be generic. Only recommend salons from the provided database using their exact id and name. Respond in the same language the user writes in.`;
}

function enrichRecommendations(
  raw: RawRecommendation[]
): ConciergeRecommendation[] {
  return raw.slice(0, 3).map((rec) => {
    const salonId = rec.salonId ?? "";
    const slug =
      getSalonSlugById(salonId) ??
      getAllSalons().find((s) => s.name === rec.salonName)?.slug ??
      "";

    return {
      salonId,
      salonName: rec.salonName ?? "Recommended Artist",
      slug,
      matchScore: Math.min(99, Math.max(85, rec.matchScore ?? 90)),
      reasoning: rec.reasoning ?? "",
      specialNote: rec.specialNote ?? "",
    };
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ConciergeRequestBody;
    const userMessage = body.userMessage?.trim();

    if (!userMessage) {
      return NextResponse.json(
        { error: "userMessage is required" },
        { status: 400 }
      );
    }

    const salonContext = getSalonContextForConcierge();
    const salonJson = JSON.stringify(salonContext);
    const systemPrompt = buildSystemPrompt(salonJson);

    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from LUNÉVIA Concierge" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content) as RawConciergeResponse;

    const response: ConciergeApiResponse = {
      message:
        parsed.message ??
        "I've found three artists who would be perfect for your vision.",
      recommendations: enrichRecommendations(parsed.recommendations ?? []),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[concierge]", error);
    return NextResponse.json(
      { error: "LUNÉVIA Concierge is temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
