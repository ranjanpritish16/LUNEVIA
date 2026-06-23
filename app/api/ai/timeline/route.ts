import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import type { TimelineResponse } from "@/lib/types/timeline";

interface TimelineRequestBody {
  weddingDate: string; // ISO format or YYYY-MM-DD
}

const TIMELINE_PROMPT = (monthsOut: number) => `You are LUNÉVIA's expert bridal beauty planner.
Create a personalized, month-by-month beauty timeline for a bride who is ${monthsOut} months away from her wedding.

CONSTRAINT: Keep tasks STRICTLY focused on Beauty & Salon bookings (skincare routines, facials, hair coloring/cutting, makeup trials, mehendi booking, nail prep, etc.). DO NOT include general wedding planning, catering, fitness, or diet tasks.

Distribute tasks logically based on how many months are left. The timeline should end at "Wedding Week" (monthsOut: 0).
If the bride is only 1-2 months away, condense the timeline appropriately.

Return ONLY a valid JSON object matching this exact schema:
{
  "phases": [
    {
      "phase": "String (e.g., '6 Months Out', '3 Months Out', 'Wedding Week')",
      "monthsOut": Number (e.g., 6, 3, 0),
      "tasks": [
        {
          "title": "String (Task title, e.g., 'Book Makeup Artist')",
          "description": "String (1-2 sentences explaining why and what to do)",
          "category": "String (Must be exactly one of: 'Skincare', 'Haircare', 'Makeup', 'Mehendi', 'Booking')",
          "isCritical": Boolean (true if this is a major milestone like booking the main MUA or starting chemical peels)
        }
      ]
    }
  ]
}

Ensure the phases are sorted chronologically from furthest out to closest (ending with 0 months out).`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TimelineRequestBody;
    const { weddingDate } = body;

    if (!weddingDate) {
      return NextResponse.json(
        { error: "weddingDate is required" },
        { status: 400 }
      );
    }

    const date = new Date(weddingDate);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid wedding date format" },
        { status: 400 }
      );
    }

    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let monthsOut = Math.round(diffDays / 30);

    if (monthsOut < 0) {
      return NextResponse.json(
        { error: "Wedding date must be in the future" },
        { status: 400 }
      );
    }

    // Cap the planning timeline at 12 months for beauty
    if (monthsOut > 12) monthsOut = 12;

    const prompt = TIMELINE_PROMPT(monthsOut);

    const model = getGeminiModel();
    const result = await model.generateContent([{ text: prompt }]);

    if (!result) {
      throw new Error("Timeline generation is temporarily unavailable.");
    }

    let text = result.response.text();
    if (!text) {
      throw new Error("No response from Gemini");
    }

    text = text.replace(/```json\n?|\n?```/g, "").trim();
    const data = JSON.parse(text) as TimelineResponse;

    return NextResponse.json(data);
  } catch (error) {
    console.error("[timeline]", error);
    return NextResponse.json(
      { error: "Failed to generate timeline. Please try again." },
      { status: 500 }
    );
  }
}
