"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api/client";
import type { PortfolioSnapshot } from "@/lib/types";
import { formatPct, formatUsdCompact } from "@/lib/format";
import { MetricCard } from "@/components/metric-card";
import { HoldingsTable } from "@/components/holdings-table";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: PortfolioSnapshot };

export function PortfolioDashboard() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setState({ status: "loading" });
      try {
        const data = await api.getPortfolioSnapshot({
          signal: controller.signal,
        });
        setState({ status: "ready", data });
      } catch (error) {
        if (controller.signal.aborted) return;
        const message =
          error instanceof ApiError
            ? error.message
            : "Unable to load portfolio snapshot.";
        setState({ status: "error", message });
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  if (state.status === "loading") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-600"
      >
        Loading portfolio snapshot…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div
        role="alert"
        className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-900"
      >
        <p className="font-semibold">Could not load insights</p>
        <p className="mt-1 text-sm">{state.message}</p>
        <button
          type="button"
          className="mt-4 min-h-10 rounded-md bg-rose-800 px-4 py-2 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-900"
          onClick={() => {
            setState({ status: "loading" });
            void api
              .getPortfolioSnapshot()
              .then((data) => setState({ status: "ready", data }))
              .catch((error: unknown) => {
                const message =
                  error instanceof ApiError
                    ? error.message
                    : "Unable to load portfolio snapshot.";
                setState({ status: "error", message });
              });
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const { data } = state;
  const asOf = new Date(data.asOf).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="space-y-8">
      <section
        aria-labelledby="summary-heading"
        className="rounded-2xl border border-slate-200/80 bg-white/75 p-6 shadow-sm backdrop-blur sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-800">
          Morning book
        </p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2
              id="summary-heading"
              className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
            >
              {formatUsdCompact(data.totalValueUsd)}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
              Consolidated NAV for the model multi-asset book. Figures are demo
              data served through a typed API layer.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-4 text-sm sm:min-w-[16rem]">
            <div>
              <dt className="text-slate-500">Day change</dt>
              <dd
                className={`mt-1 font-semibold tabular-nums ${
                  data.dayChangePct >= 0 ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {formatPct(data.dayChangePct)}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">As of</dt>
              <dd className="mt-1 font-medium text-slate-800">{asOf}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">
          Key metrics
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {data.metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      <HoldingsTable holdings={data.holdings} />
    </div>
  );
}
