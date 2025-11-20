import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAIClient } from "@/lib/openai";
import { buildVisualPrompt } from "@/lib/agentPrompts";

const visualSchema = z.object({
  assetType: z.string().min(3),
  concept: z.string().min(3),
  callToAction: z.string().min(3),
  brandColors: z.string().min(3),
  platforms: z.string().min(3),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsed = visualSchema.parse(data);
    const client = getOpenAIClient();

    const strategyPrompt = buildVisualPrompt(parsed);
    const refinement = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are an award-winning brand designer. Return concise prompts in 80 words or less.",
        },
        {
          role: "user",
          content: strategyPrompt,
        },
      ],
    });

    const optimizedPrompt = refinement.output_text;
    if (!optimizedPrompt) {
      throw new Error("Unable to craft visual prompt.");
    }

    const image = await client.images.generate({
      model: "gpt-image-1",
      prompt: optimizedPrompt,
      size: "1024x1024",
      quality: "high",
    });

    const imageData = image.data?.[0]?.b64_json;
    if (!imageData) {
      throw new Error("Image generation failed.");
    }

    return NextResponse.json({
      prompt: optimizedPrompt,
      imageBase64: imageData,
    });
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
          error instanceof Error ? error.message : "Unable to generate visual.",
      },
      { status: 500 }
    );
  }
}
