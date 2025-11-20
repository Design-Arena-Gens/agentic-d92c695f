import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAIClient } from "@/lib/openai";
import { buildStrategyPrompt } from "@/lib/agentPrompts";

const strategySchema = z.object({
  niche: z.string().min(3),
  tone: z.string().min(3),
  goals: z.string().min(3),
  platforms: z.string().min(3),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsed = strategySchema.parse(data);

    const client = getOpenAIClient();

    const prompt = buildStrategyPrompt(parsed);
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are an elite social media growth operator and marketing creative director. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.output_text;
    if (!text) {
      throw new Error("Unexpected response payload.");
    }

    const sanitized = text
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    const resultJson = JSON.parse(sanitized);
    return NextResponse.json(resultJson);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate strategy.",
      },
      { status: 500 }
    );
  }
}
