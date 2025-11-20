"use client";

/* eslint-disable @next/next/no-img-element */

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { SectionCard } from "@/components/SectionCard";

type PredictionState = {
  id: string | null;
  status: string | null;
  outputUrl: string | null;
  error: string | null;
};

const DEFAULT_STATE: PredictionState = {
  id: null,
  status: null,
  outputUrl: null,
  error: null,
};

const MOTION_LEVELS = [
  { label: "Cinematic Sweep", value: "cinematic" },
  { label: "Steady Momentum", value: "default" },
  { label: "Ambitious Moves", value: "extreme" },
  { label: "Minimal Drift", value: "low" },
];

export function VideoProducer() {
  const [file, setFile] = useState<File | null>(null);
  const [motionLevel, setMotionLevel] = useState("cinematic");
  const [fps, setFps] = useState(24);
  const [creativeBrief, setCreativeBrief] = useState("");
  const [prediction, setPrediction] = useState<PredictionState>(DEFAULT_STATE);
  const [isPending, startTransition] = useTransition();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!prediction.id || prediction.status === "succeeded") {
      return;
    }

    const poll = async () => {
      try {
        const response = await fetch(
          `/api/video/status?id=${prediction.id ?? ""}`
        );
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || "Failed to poll status.");
        }

        const payload = (await response.json()) as {
          status: string;
          output?: string[] | string | null;
          error?: string | null;
        };

        if (payload.status === "succeeded") {
          const output = Array.isArray(payload.output)
            ? payload.output[0]
            : payload.output;
          setPrediction((state) => ({
            ...state,
            status: payload.status,
            outputUrl: output ?? null,
            error: null,
          }));
          if (pollRef.current) {
            clearInterval(pollRef.current);
          }
        } else if (payload.status === "failed") {
          setPrediction((state) => ({
            ...state,
            status: payload.status,
            error: payload.error ?? "Video generation failed.",
          }));
          if (pollRef.current) {
            clearInterval(pollRef.current);
          }
        } else {
          setPrediction((state) => ({
            ...state,
            status: payload.status,
          }));
        }
      } catch (error) {
        console.error(error);
        setPrediction((state) => ({
          ...state,
          status: "error",
          error: error instanceof Error ? error.message : "Polling failed.",
        }));
        if (pollRef.current) {
          clearInterval(pollRef.current);
        }
      }
    };

    pollRef.current = setInterval(poll, 4000);
    poll();

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, [prediction.id, prediction.status]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setPrediction({
        ...DEFAULT_STATE,
        error: "Upload a reference image to animate.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const form = new FormData();
        form.append("image", file);
        form.append("motionLevel", motionLevel);
        form.append("fps", String(fps));
        form.append("creativeBrief", creativeBrief);

        const response = await fetch("/api/video/start", {
          method: "POST",
          body: form,
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || "Failed to start generation.");
        }

        const payload = (await response.json()) as {
          id: string;
          status: string;
        };

        setPrediction({
          id: payload.id,
          status: payload.status,
          outputUrl: null,
          error: null,
        });
      } catch (error) {
        console.error(error);
        setPrediction({
          id: null,
          status: "error",
          outputUrl: null,
          error: error instanceof Error ? error.message : "Unexpected error.",
        });
      }
    });
  };

  const resetWorkflow = () => {
    setFile(null);
    setCreativeBrief("");
    setPrediction(DEFAULT_STATE);
    if (pollRef.current) {
      clearInterval(pollRef.current);
    }
  };

  return (
    <SectionCard
      title="Video Synth Lab"
      description="Animate still images into short-form social-ready videos with motion control."
      actionSlot={
        <span className="text-xs font-medium uppercase tracking-wide text-fuchsia-600 dark:text-fuchsia-300">
          Motion AI
        </span>
      }
    >
      <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
        <label
          className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-fuchsia-400 bg-fuchsia-50/60 p-6 text-center text-sm text-fuchsia-700 transition hover:border-fuchsia-500 dark:border-fuchsia-500/40 dark:bg-fuchsia-500/10 dark:text-fuchsia-100 lg:row-span-3"
          htmlFor="video-image-upload"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Reference preview"
              className="h-48 w-full rounded-xl object-cover"
            />
          ) : (
            <>
              <span className="text-lg font-semibold">Drop cover art</span>
              <span>PNG or JPG · 2K max</span>
            </>
          )}
          <input
            id="video-image-upload"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(event) => {
              const nextFile = event.target.files?.[0];
              if (nextFile) {
                setFile(nextFile);
              }
            }}
          />
          <span className="inline-flex items-center justify-center rounded-full bg-fuchsia-600 px-4 py-2 text-xs font-semibold text-white">
            Upload Reference
          </span>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Motion Profile
          </span>
          <select
            value={motionLevel}
            onChange={(event) => setMotionLevel(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-fuchsia-500 transition focus:border-fuchsia-500 focus:ring-2 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
          >
            {MOTION_LEVELS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Frames Per Second
          </span>
          <input
            type="number"
            min={10}
            max={30}
            value={fps}
            onChange={(event) => setFps(Number(event.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-fuchsia-500 transition focus:border-fuchsia-500 focus:ring-2 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
          />
        </label>

        <label className="flex flex-col gap-2 lg:col-span-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Motion Direction Brief
          </span>
          <textarea
            rows={3}
            value={creativeBrief}
            onChange={(event) => setCreativeBrief(event.target.value)}
            placeholder="Push camera through neon city skyline, highlight hero text with subtle glow."
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-fuchsia-500 transition focus:border-fuchsia-500 focus:ring-2 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
          />
        </label>

        <div className="flex flex-col gap-3 lg:col-span-2 lg:flex-row">
          <button
            type="submit"
            disabled={isPending || !file}
            className="flex-1 rounded-xl bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-600/30 transition hover:bg-fuchsia-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
          >
            {isPending ? "Uploading…" : "Animate Reference"}
          </button>
          <button
            type="button"
            onClick={resetWorkflow}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {prediction.status && (
          <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-fuchsia-500" />
            <span>
              Status:{" "}
              <span className="uppercase tracking-wide">
                {prediction.status}
              </span>
            </span>
          </div>
        )}

        {prediction.error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
            {prediction.error}
          </p>
        )}

        {prediction.outputUrl && (
          <video
            src={prediction.outputUrl}
            controls
            className="w-full rounded-3xl border border-slate-100 shadow-lg dark:border-white/10"
          />
        )}
      </div>
    </SectionCard>
  );
}
