"use client";

import { FormEvent, useState, useTransition } from "react";
import { SectionCard } from "@/components/SectionCard";

type StrategyResponse = {
  brandNarrative: string;
  audienceInsights: string[];
  growthPillars: {
    name: string;
    promise: string;
    contentAngles: string[];
  }[];
  weeklyPublishingCalendar: {
    day: string;
    platform: string;
    format: string;
    hook: string;
    creativeBrief: string;
    callToAction: string;
  }[];
  influencerScripts: {
    title: string;
    hook: string;
    beats: string[];
    close: string;
  }[];
  collaborationIdeas: string[];
  metricsToTrack: string[];
};

const INITIAL_FORM = {
  niche: "",
  tone: "",
  goals: "",
  platforms: "",
};

export function StrategyPlanner() {
  const [formState, setFormState] = useState(INITIAL_FORM);
  const [strategy, setStrategy] = useState<StrategyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/strategy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || "Failed to generate strategy.");
        }

        const payload = (await response.json()) as StrategyResponse;
        setStrategy(payload);
      } catch (err) {
        console.error(err);
        setStrategy(null);
        setError(err instanceof Error ? err.message : "Unexpected error.");
      }
    });
  };

  return (
    <SectionCard
      title="Growth Strategy Architect"
      description="Generate a full-funnel content system with narratives, weekly programming, scripts, partners, and KPIs."
      actionSlot={
        <span className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
          Agent Mode
        </span>
      }
    >
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Influence Niche
          </span>
          <input
            required
            value={formState.niche}
            onChange={(event) =>
              setFormState((state) => ({
                ...state,
                niche: event.target.value,
              }))
            }
            placeholder="Fitness biohacking for busy founders"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-emerald-500 transition focus:border-emerald-500 focus:ring-2 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Voice &amp; Tone
          </span>
          <input
            required
            value={formState.tone}
            onChange={(event) =>
              setFormState((state) => ({
                ...state,
                tone: event.target.value,
              }))
            }
            placeholder="High-energy, tactical, witty"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-emerald-500 transition focus:border-emerald-500 focus:ring-2 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Growth Objectives
          </span>
          <textarea
            required
            rows={3}
            value={formState.goals}
            onChange={(event) =>
              setFormState((state) => ({
                ...state,
                goals: event.target.value,
              }))
            }
            placeholder="Launch a monetized newsletter, reach 200k TikTok followers, convert 5% to coaching clients."
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-emerald-500 transition focus:border-emerald-500 focus:ring-2 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 sm:col-span-2"
          />
        </label>
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Priority Platforms
          </span>
          <input
            required
            value={formState.platforms}
            onChange={(event) =>
              setFormState((state) => ({
                ...state,
                platforms: event.target.value,
              }))
            }
            placeholder="TikTok, Instagram Reels, YouTube Shorts, LinkedIn"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-emerald-500 transition focus:border-emerald-500 focus:ring-2 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 sm:col-span-2"
        >
          {isPending ? "Generating…" : "Launch Growth Blueprint"}
        </button>
      </form>

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
          {error}
        </p>
      )}

      {strategy && (
        <div className="space-y-6">
          <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Brand Narrative
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {strategy.brandNarrative}
            </p>
          </article>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Audience Insights
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {strategy.audienceInsights.map((insight, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Metrics to Track
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {strategy.metricsToTrack.map((metric, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
              Growth Pillars
            </h4>
            <div className="mt-4 space-y-4">
              {strategy.growthPillars.map((pillar, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/10"
                >
                  <h5 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                    {pillar.name}
                  </h5>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {pillar.promise}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {pillar.contentAngles.map((angle) => (
                      <li
                        key={angle}
                        className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
                      >
                        {angle}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
              Weekly Publishing Calendar
            </h4>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {strategy.weeklyPublishingCalendar.map((slot, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-emerald-600/10 bg-emerald-50/70 p-4 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-400/10"
                >
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                    <span>{slot.day}</span>
                    <span>
                      {slot.platform} · {slot.format}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Hook: {slot.hook}
                  </p>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                    {slot.creativeBrief}
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                    CTA: {slot.callToAction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Influencer Scripts
              </h4>
              <div className="mt-4 space-y-4">
                {strategy.influencerScripts.map((script) => (
                  <article
                    key={script.title}
                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/10"
                  >
                    <h5 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                      {script.title}
                    </h5>
                    <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-300">
                      Opening hook: {script.hook}
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {script.beats.map((beat) => (
                        <li key={beat} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
                          <span>{beat}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                      Close: {script.close}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Collab &amp; Partnership Ideas
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {strategy.collaborationIdeas.map((idea) => (
                  <li key={idea} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
