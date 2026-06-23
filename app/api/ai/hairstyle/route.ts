import { NextResponse } from "next/server";

import { getGeminiModel } from "@/lib/gemini";
import type {
  HairstyleApiResponse,
  HairstyleRecommendation,
} from "@/lib/types/hairstyle";
import type { FaceMeasurements } from "@/lib/faceMesh";

interface HairstyleRequestBody {
  measurements?: FaceMeasurements;
}

interface RawHairstyleResponse {
  faceShape?: string;
  confidence?: string;
  characteristics?: string;
  recommendations?: Partial<HairstyleRecommendation>[];
}

const FACE_SHAPE_CLASSIFICATION_PROMPT = (measurements: FaceMeasurements) => `You are an expert face shape analyzer. Classify the face shape based on these facial measurements using strict geometric rules.

Facial Measurements:
- Face Length: ${measurements.faceLength}px
- Jaw Width: ${measurements.jawWidth}px
- Forehead Width: ${measurements.foreheadWidth}px
- Cheekbone Width: ${measurements.cheekboneWidth}px
- Length:Width Ratio: ${measurements.lengthToWidthRatio}
- Jaw:Forehead Ratio: ${measurements.jawToForeheadRatio}
- Cheekbone:Jaw Ratio: ${measurements.cheekboneToJawRatio}

CLASSIFICATION RULES (apply in this order):
1. ROUND: Length:Width < 1.1 AND |Jaw - Forehead| < Jaw*0.15 AND Cheekbone:Jaw < 1.0
2. SQUARE: Length:Width < 1.1 AND |Jaw - Forehead| < Jaw*0.15 AND Cheekbone:Jaw >= 1.0
3. HEART: Forehead > Jaw*1.15 AND Length:Width < 1.3
4. INVERTED TRIANGLE: Forehead > Jaw*1.15 AND Length:Width >= 1.3
5. TRIANGLE (Pear): Jaw > Forehead*1.15 AND Length:Width >= 1.3
6. DIAMOND: Cheekbone > Jaw*1.05 AND Cheekbone < Jaw*1.25 AND Length:Width between 1.1-1.5
7. RECTANGLE: Length:Width >= 1.5 AND |Jaw - Forehead| < Jaw*0.2 AND Cheekbone:Jaw < 1.05
8. OVAL: Length:Width > 1.2 AND other shapes don't match

Then generate 3 bridal hairstyle recommendations for that face shape.

Respond ONLY in valid JSON:
{
  "faceShape": "string (one of: Round, Square, Heart, Inverted Triangle, Triangle, Diamond, Rectangle, Oval)",
  "confidence": "High",
  "characteristics": "string (2 sentences describing this face shape and why certain hairstyles suit it)",
  "recommendations": [
    {
      "style": "string (hairstyle name)",
      "description": "string (2 sentences)",
      "whyItWorks": "string (1 sentence explaining why it suits this face shape)",
      "bestFor": "string (occasion type)"
    }
  ]
}`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HairstyleRequestBody;
    const measurements = body.measurements;

    if (!measurements) {
      return NextResponse.json(
        { error: "measurements is required" },
        { status: 400 }
      );
    }

    const modelName = process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite";
    const model = getGeminiModel(modelName);

    let result;
    let attempts = 0;
    const maxAttempts = 3;
    let lastError: any;

    while (attempts < maxAttempts) {
      try {
        result = await model.generateContent([
          { text: FACE_SHAPE_CLASSIFICATION_PROMPT(measurements) },
        ]);
        break;
      } catch (err: any) {
        lastError = err;
        attempts++;
        console.error(`[hairstyle] model generateContent error (attempt ${attempts}):`, err?.message);
        
        const msg = err?.message ?? String(err);
        if (msg.includes("not found") || msg.includes("not supported") || err?.status === 404) {
          break; // Do not retry on 404
        }
        
        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    }

    if (!result) {
      if (lastError) {
        const msg = lastError?.message ?? String(lastError);
        if (msg.includes("not found") || msg.includes("not supported") || lastError?.status === 404) {
          return NextResponse.json(
            {
              error: `Gemini model '${modelName}' is not available for generateContent. Set a supported model via GEMINI_MODEL in .env.local or call ModelService.ListModels to discover available models.`,
            },
            { status: 500 }
          );
        }
        throw lastError;
      }
      throw new Error("Failed to generate content");
    }

    const text = result.response.text();

    if (!text) {
      return NextResponse.json(
        { error: "No hairstyle recommendations returned from Gemini" },
        { status: 500 }
      );
    }

    let parsed: RawHairstyleResponse;
    try {
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        const jsonStr = text.substring(firstBrace, lastBrace + 1);
        parsed = JSON.parse(jsonStr) as RawHairstyleResponse;
      } else {
        const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
        parsed = JSON.parse(cleaned) as RawHairstyleResponse;
      }
    } catch (parseError) {
      console.error("[hairstyle] JSON parse error:", parseError);
      console.error("Raw text was:", text);
      throw new Error("Failed to parse AI response as JSON");
    }

    const recommendations: HairstyleRecommendation[] = (
      parsed.recommendations ?? []
    )
      .slice(0, 3)
      .map((rec) => ({
        style: rec.style ?? "Bridal Style",
        description: rec.description ?? "",
        whyItWorks: rec.whyItWorks ?? "",
        bestFor: rec.bestFor ?? "Wedding day",
      }));

    const response: HairstyleApiResponse = {
      faceShape: parsed.faceShape ?? "Oval",
      confidence: "High",
      characteristics:
        parsed.characteristics ??
        `Face shape classified based on facial measurements.`,
      recommendations,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[hairstyle]", error);
    return NextResponse.json(
      {
        error:
          "Hairstyle analysis is temporarily unavailable. Error: " + (error as any).message,
      },
      { status: 500 }
    );
  }
}
