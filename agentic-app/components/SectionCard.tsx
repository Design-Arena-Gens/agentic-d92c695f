import { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description: string;
  actionSlot?: ReactNode;
  children: ReactNode;
};

export function SectionCard({
  title,
  description,
  actionSlot,
  children,
}: SectionCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/70 p-8 shadow-xl shadow-black/5 backdrop-blur-md transition hover:-translate-y-1 hover:shadow-2xl dark:border-white/5 dark:bg-white/5">
      <div className="flex flex-col gap-5">
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              {title}
            </h2>
            {actionSlot}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </header>
        <div className="space-y-6">{children}</div>
      </div>
    </section>
  );
}
