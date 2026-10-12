import type { InsightMetric } from "@/lib/types";

const toneClass: Record<InsightMetric["tone"], string> = {
  up: "text-emerald-700",
  down: "text-rose-700",
  neutral: "text-slate-600",
};

export function MetricCard({ metric }: { metric: InsightMetric }) {
  return (
    <article
      className="rounded-lg border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur"
      aria-labelledby={`metric-${metric.id}`}
    >
      <h3
        id={`metric-${metric.id}`}
        className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500"
      >
        {metric.label}
      </h3>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-900">
        {metric.value}
      </p>
      <p className={`mt-1 text-sm ${toneClass[metric.tone]}`}>
        {metric.deltaLabel}
      </p>
    </article>
  );
}
