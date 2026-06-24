import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini";

interface SalonDataInput {
    salonName: string;
    specialties: string[];
    averageRating: number;
    reviewHighlights?: string[];
    services: { name: string; price: number; category: string }[];
    priceRange: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as { salonData?: SalonDataInput };
        const salonData = body.salonData;

        if (!salonData?.salonName) {
            return NextResponse.json({ error: "salonData with salonName is required" }, { status: 400 });
        }

        const model = getGeminiModel();
        const offerType = Math.random() < 0.5 ? "percentage_discount" : "flat_discount";
        const discountValue =
            offerType === "percentage_discount"
                ? [10, 15, 20, 25, 30, 35, 40][Math.floor(Math.random() * 7)]
                : [1000, 1500, 2000, 2500, 3000, 4000, 5000][Math.floor(Math.random() * 7)];

        const prompt = `You are a luxury bridal-beauty marketing strategist for the Indian wedding market in Delhi.

Generate ONE promotional campaign for this salon. Respond with ONLY raw JSON, no markdown fences, no preamble.

Salon data:
- Name: ${salonData.salonName}
- Specialties: ${(salonData.specialties || []).join(", ") || "Bridal Makeup"}
- Average rating: ${salonData.averageRating ?? "N/A"}
- Price range: ${salonData.priceRange ?? "N/A"}
- Services: ${(salonData.services || []).map((s) => `${s.name} (₹${s.price}, ${s.category})`).join("; ") ||
            "Not specified"
            }
${salonData.reviewHighlights?.length ? `- Review highlights: ${salonData.reviewHighlights.join(" | ")}` : ""}

This campaign MUST use:
- offerType: "${offerType}"
- discountValue: "${discountValue}"

Build a creative, distinct campaign name, hook, and copy around these exact values — do not change them. Make the campaign name, description, target audience, and captions feel fresh and different from generic templates each time.

Return JSON with EXACTLY this shape:
{
  "campaignName": "string, catchy, under 8 words",
  "offerType": "${offerType}",
  "discountValue": "${discountValue}",
  "targetAudience": "string, 1 short sentence",
  "description": "string, 1-2 sentence promotional description",
  "instagramCaption": "string, with relevant emojis and 3-5 hashtags",
  "whatsappText": "string, short, friendly, with a clear CTA",
  "expectedIncrease": "string, e.g. '15-20% increase in bookings'"
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const cleaned = text.replace(/^```json\s*|```$/g, "").trim();

        let parsed: any;
        try {
            parsed = JSON.parse(cleaned);
        } catch {
            return NextResponse.json(
                { error: "AI returned an unparseable response. Please try again." },
                { status: 502 }
            );
        }

        const requiredFields = [
            "campaignName",
            "offerType",
            "discountValue",
            "targetAudience",
            "description",
            "instagramCaption",
            "whatsappText",
            "expectedIncrease",
        ];
        const missing = requiredFields.filter((f) => !(f in parsed));
        if (missing.length) {
            return NextResponse.json(
                { error: `AI response missing fields: ${missing.join(", ")}` },
                { status: 502 }
            );
        }

        return NextResponse.json(parsed);
    } catch (err: any) {
        console.error("[campaign-generator] error:", err);
        return NextResponse.json(
            { error: err?.message ?? "Failed to generate campaign. Please try again." },
            { status: 500 }
        );
    }
}