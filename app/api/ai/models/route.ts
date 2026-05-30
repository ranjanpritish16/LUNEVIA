import { NextResponse } from "next/server";

const DEFAULT_BASE = "https://generativelanguage.googleapis.com";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const apiVersion = process.env.GEMINI_API_VERSION ?? "v1beta";

    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 400 });
    }

    const url = `${DEFAULT_BASE}/${apiVersion}/models`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
    });

    const body = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: body?.error?.message ?? "Failed to list models", details: body }, { status: res.status });
    }

    return NextResponse.json(body);
  } catch (err) {
    console.error("[models]", err);
    return NextResponse.json({ error: "Could not fetch models" }, { status: 500 });
  }
}
