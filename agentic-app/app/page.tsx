import { StrategyPlanner } from "@/components/StrategyPlanner";
import { VisualStudio } from "@/components/VisualStudio";
import { VideoProducer } from "@/components/VideoProducer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,255,199,0.12),_transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 sm:px-8 lg:px-12">
        <header className="space-y-8 pb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Agentic Creator OS
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Launch, scale, and monetize your influence with an autonomous studio
            partner.
          </h1>
          <p className="max-w-3xl text-lg text-slate-300 sm:text-xl">
            Spin up multi-platform campaigns, produce polished visuals, script
            viral hooks, and morph imagery into kinetic stories—all orchestrated
            by one agentic creative brain built for digital influencers.
          </p>
        </header>

        <main className="grid gap-10">
          <StrategyPlanner />
          <VisualStudio />
          <VideoProducer />
        </main>
      </div>
    </div>
  );
}
