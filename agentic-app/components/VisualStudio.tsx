"use client";

/* eslint-disable @next/next/no-img-element */

import { FormEvent, useMemo, useState, useTransition } from "react";
import { SectionCard } from "@/components/SectionCard";

type VisualResponse = {
  prompt: string;
  imageBase64: string;
};

const VISUAL_OPTIONS = [
  "Instagram Carousel Cover",
  "TikTok Thumbnail",
  "LinkedIn Banner",
  "YouTube Channel Art",
  "Promotional Flyer",
];

export function VisualStudio() {
  const [assetType, setAssetType] = useState(VISUAL_OPTIONS[0]);
  const [concept, setConcept] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [brandColors, setBrandColors] = useState("");
  const [platforms, setPlatforms] = useState("Instagram, TikTok");
  const [error, setError] = useState<string | null>(null);
  const [visual, setVisual] = useState<VisualResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  const previewUrl = useMemo(() => {
    if (!visual?.imageBase64) return "";
    return `data:image/png;base64,${visual.imageBase64}`;
  }, [visual]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/visual", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assetType,
            concept,
            callToAction,
            brandColors,
            platforms,
          }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || "Failed to generate visual.");
        }

        const payload = (await response.json()) as VisualResponse;
        setVisual(payload);
      } catch (err) {
        console.error(err);
        setVisual(null);
        setError(err instanceof Error ? err.message : "Unexpected error.");
      }
    });
  };

  return (
    <SectionCard
      title="Visual Content Studio"
      description="Craft scroll-stopping artwork, banners, and promo flyers tailored to each platform."
      actionSlot={
        <span className="text-xs font-medium uppercase tracking-wide text-sky-600 dark:text-sky-300">
          Diffusion Lab
        </span>
      }
    >
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Asset Type
          </span>
          <select
            value={assetType}
            onChange={(event) => setAssetType(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-sky-500 transition focus:border-sky-500 focus:ring-2 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
          >
            {VISUAL_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Campaign Concept
          </span>
          <input
            required
            value={concept}
            onChange={(event) => setConcept(event.target.value)}
            placeholder="Summer launch for the 'Daily Upgrade' program"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-sky-500 transition focus:border-sky-500 focus:ring-2 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Call to Action
          </span>
          <input
            required
            value={callToAction}
            onChange={(event) => setCallToAction(event.target.value)}
            placeholder="Save your seat for the live masterclass"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-sky-500 transition focus:border-sky-500 focus:ring-2 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Brand Palette
          </span>
          <input
            required
            value={brandColors}
            onChange={(event) => setBrandColors(event.target.value)}
            placeholder="Deep navy, sunrise orange, champagne"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-sky-500 transition focus:border-sky-500 focus:ring-2 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Target Platforms
          </span>
          <input
            required
            value={platforms}
            onChange={(event) => setPlatforms(event.target.value)}
            placeholder="Instagram Reels cover, TikTok, Pinterest"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-sky-500 transition focus:border-sky-500 focus:ring-2 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="md:col-span-2 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/30 transition hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
        >
          {isPending ? "Rendering…" : "Synthesize Visual"}
        </button>
      </form>

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
          {error}
        </p>
      )}

      {visual && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-950/80 shadow-xl dark:border-white/10">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Generated visual asset"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-slate-400">
                Preview unavailable.
              </div>
            )}
          </div>
          <aside className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
              Diffusion Prompt
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-200">
              {visual.prompt}
            </p>
            {previewUrl && (
              <a
                href={previewUrl}
                download="visual.png"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-50 shadow-sm transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Download PNG
              </a>
            )}
          </aside>
        </div>
      )}
    </SectionCard>
  );
}
