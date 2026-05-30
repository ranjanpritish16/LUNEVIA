import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGeminiModel(modelName = process.env.GEMINI_MODEL ?? "gemini-1.5-flash") {
  const apiKey = process.env.GEMINI_API_KEY;
  const apiVersion = process.env.GEMINI_API_VERSION ?? "v1beta";

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add `GEMINI_API_KEY=<your-key>` to your .env.local (server-side) and restart the dev server."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName }, { apiVersion });
}
