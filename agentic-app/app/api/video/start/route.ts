import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MODEL_VERSION =
  "c83c4675d174a23a3ae9935be98b9f96e65e74dfdc153a76afb29d946a9ab0fe";

function mapMotionBucket(level: string) {
  switch (level) {
    case "low":
      return 80;
    case "cinematic":
      return 140;
    case "extreme":
      return 200;
    default:
      return 120;
  }
}

export async function POST(request: Request) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      throw new Error("Missing REPLICATE_API_TOKEN environment variable.");
    }

    const formData = await request.formData();
    const file = formData.get("image");
    const motionLevel = String(formData.get("motionLevel") ?? "default");
    const fps = Number(formData.get("fps") ?? 24);
    const creativeBrief = String(formData.get("creativeBrief") ?? "");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Upload an image file to convert into a video." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are supported." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          image: dataUri,
          motion_bucket_id: mapMotionBucket(motionLevel),
          fps,
          cfg_scale: 1.8,
          cond_aug: 0.2,
          text_prompt: creativeBrief || undefined,
          output_format: "mp4",
        },
      }),
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      throw new Error(
        errorPayload?.detail || "Failed to start video generation."
      );
    }

    const prediction = await response.json();

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to start video generation.",
      },
      { status: 500 }
    );
  }
}
