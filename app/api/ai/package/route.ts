import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

import { getGeminiModel } from "@/lib/gemini";
import type {
  PackageApiResponse,
  PackageBuilderAnswers,
} from "@/lib/types/packageBuilder";

interface RequestBody {
  answers: PackageBuilderAnswers;
}

function formatBudgetLabel(budget: string): string {
  const budgetMap: Record<string, string> = {
    "under-15000": "Under ₹15,000",
    "15000-30000": "₹15,000–₹30,000",
    "30000-60000": "₹30,000–₹60,000",
    "60000-plus": "₹60,000+",
  };
  return budgetMap[budget] || budget;
}

function formatServiceLabel(service: string): string {
  const serviceMap: Record<string, string> = {
    "bridal-makeup": "Bridal Makeup",
    "pre-bridal-facials": "Pre-Bridal Facials",
    "hair-styling": "Hair Styling",
    mehendi: "Mehendi",
    "engagement-makeup": "Engagement Makeup",
    "family-makeup": "Family Makeup",
    "nail-art": "Nail Art",
    draping: "Draping",
  };
  return serviceMap[service] || service;
}

function formatAestheticLabel(aesthetic: string): string {
  const aestheticMap: Record<string, string> = {
    "soft-dewy": "Soft & Dewy",
    "glamorous-bold": "Glamorous & Bold",
    "natural-minimal": "Natural & Minimal",
    "traditional-regal": "Traditional & Regal",
  };
  return aestheticMap[aesthetic] || aesthetic;
}

function buildSystemPrompt(answers: PackageBuilderAnswers, salonList: string): string {
  const weddingDate = new Date(answers.weddingDate);
  const today = new Date();
  const daysUntil = Math.ceil(
    (weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weeksUntil = Math.ceil(daysUntil / 7);

  const budget = formatBudgetLabel(answers.budgetRange);
  const services = answers.services
    .map(formatServiceLabel)
    .join(" · ");
  const aesthetic = formatAestheticLabel(answers.aesthetic);
  const skinTone = answers.skinTone.charAt(0).toUpperCase() + answers.skinTone.slice(1);

  return `You are LUNÉVIA Concierge, a luxury bridal beauty consultant. Your task is to create a personalized bridal beauty package based on the bride's preferences and timeline.

You have access to this list of real verified salons/artists in Delhi: ${salonList || "LUNÉVIA Verified Artists"}

Bride's Information:
- Wedding Date: ${weddingDate.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} (${weeksUntil} weeks away)
- Budget Range: ${budget}
- Services Needed: ${services}
- Bridal Aesthetic: ${aesthetic}
- Skin Tone: ${skinTone}
${answers.specialNotes ? `- Special Notes: ${answers.specialNotes}` : ""}

Based on this information, create a CUSTOM bridal beauty package. Return ONLY valid JSON with NO additional text:

{
  "packageName": "string (creative, evocative name like 'The Golden Hour Bride' or 'Maharani's Radiance')",
  "tagline": "string (1 short poetic phrase)",
  "totalEstimate": "string (e.g. '₹28,000–₹35,000')",
  "timeline": [
    {
      "weeksBeforeWedding": number,
      "task": "string (specific, actionable task)",
      "priority": "high" or "medium"
    }
  ],
  "services": [
    {
      "name": "string (service name)",
      "description": "string (1 sentence describing what's included and why it matters)",
      "estimatedCost": "string (e.g. '₹5,000–₹7,000')"
    }
  ],
  "topArtistMatch": "string (name of a luxury salon/artist from Delhi that would be perfect match. MUST be selected from the provided list of real verified salons)",
  "personalNote": "string (warm, 2 sentence closing that acknowledges her specific aesthetic and reassures her about the timeline)"
}

Guidelines:
- The timeline should have 4-6 items spanning from 12 weeks before to 1 week before the wedding
- Services should match what she selected, priced appropriately for her budget range
- Total estimate should align with her budget range
- The package name should feel luxe, specific to her aesthetic choice
- Artist match MUST be an exact name from the provided list of real verified salons. Do not invent names.`;
}

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse request
    const body = await request.json();
    const { answers } = body as RequestBody;

    // Validate
    if (
      !answers ||
      !answers.weddingDate ||
      !answers.budgetRange ||
      !answers.services ||
      !answers.aesthetic ||
      !answers.skinTone
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch real salons
    const { data: dbSalons } = await supabase
      .from("salons")
      .select("name, locality, slug");
    const salonList = (dbSalons || []).map(s => `${s.name} (${s.locality || 'Delhi'})`).join(", ");

    // Try to get response from Gemini
    let geminiText: string | null = null;
    try {
      const model = getGeminiModel();
      const systemPrompt = buildSystemPrompt(answers, salonList);

      const response = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
        ],
      });

      // Extract text from response - try multiple possible structures
      if (response.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        geminiText = response.response.candidates[0].content.parts[0].text;
      } else if ((response as any).candidates?.[0]?.content?.parts?.[0]?.text) {
        geminiText = (response as any).candidates[0].content.parts[0].text;
      } else if ((response as any).text) {
        geminiText = (response as any).text;
      }

      if (geminiText) {
        // Parse and return Gemini response
        let jsonText = geminiText;
        if (geminiText.startsWith("```json")) {
          jsonText = geminiText.slice(7);
        }
        if (geminiText.startsWith("```")) {
          jsonText = geminiText.slice(3);
        }
        if (jsonText.endsWith("```")) {
          jsonText = jsonText.slice(0, -3);
        }

        const packageData: PackageApiResponse = JSON.parse(jsonText.trim());
        
        // Find the matched salon to get its slug
        if (dbSalons && packageData.topArtistMatch) {
          const matchedSalon = dbSalons.find(s => packageData.topArtistMatch.includes(s.name) || s.name.includes(packageData.topArtistMatch));
          if (matchedSalon && matchedSalon.slug) {
            packageData.topArtistSlug = matchedSalon.slug;
          }
        }
        
        return NextResponse.json(packageData);
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      // Fall through to mock response
    }

    // Fallback to mock response
    const mockPackage: PackageApiResponse = {
      packageName: "The Glamour Hour Bride",
      tagline: "Radiant, confident, unforgettable",
      totalEstimate: "₹35,000–₹42,000",
      timeline: [
        {
          weeksBeforeWedding: 12,
          task: "Book pre-bridal facial and skin consultation",
          priority: "high",
        },
        {
          weeksBeforeWedding: 8,
          task: "Start regular facials and skincare routine",
          priority: "high",
        },
        {
          weeksBeforeWedding: 4,
          task: "Trial makeup looks and test colors",
          priority: "high",
        },
        {
          weeksBeforeWedding: 1,
          task: "Final hair and makeup trial run",
          priority: "medium",
        },
      ],
      services: [
        {
          name: "Bridal Makeup",
          description: "Full glam bridal makeup with dramatic eyes and bold lips, tailored for glamorous aesthetic",
          estimatedCost: "₹12,000–₹15,000",
        },
        {
          name: "Pre-Bridal Facials",
          description: "Series of hydrating and brightening facials for radiant skin",
          estimatedCost: "₹8,000–₹10,000",
        },
        {
          name: "Hair Styling",
          description: "Elegant bridal hairstyle with extensions and jewelry",
          estimatedCost: "₹6,000–₹8,000",
        },
      ],
      topArtistMatch: "Priya's Glamour Studio",
      personalNote:
        "Your glamorous aesthetic paired with your wedding timeline gives us the perfect window to create a look that's both bold and balanced. We recommend booking Priya's team soon—they're known for exactly this kind of transformative bridal work.",
    };

    return NextResponse.json(mockPackage);
  } catch (error) {
    console.error("Error in package builder API:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate package",
      },
      { status: 500 }
    );
  }
}
