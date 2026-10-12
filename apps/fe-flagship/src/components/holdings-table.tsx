"use client";

import { useMemo, useState } from "react";
import type { AssetClass, Holding } from "@/lib/types";
import { assetClassLabel, formatPct, formatUsdCompact } from "@/lib/format";

const FILTERS: Array<{ id: "all" | AssetClass; label: string }> = [
  { id: "all", label: "All" },
  { id: "equity", label: "Equity" },
  { id: "fixed_income", label: "Fixed income" },
  { id: "private_equity", label: "Private equity" },
  { id: "real_estate", label: "Real estate" },
  { id: "cash", label: "Cash" },
];

type SortKey = "weightPct" | "dayChangePct" | "ytdReturnPct" | "marketValueUsd";

export function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  const [filter, setFilter] = useState<"all" | AssetClass>("all");
  const [sortKey, setSortKey] = useState<SortKey>("weightPct");

  const rows = useMemo(() => {
    const filtered =
      filter === "all"
        ? holdings
        : holdings.filter((h) => h.assetClass === filter);
    return [...filtered].sort((a, b) => b[sortKey] - a[sortKey]);
  }, [filter, holdings, sortKey]);

  return (
    <section aria-labelledby="holdings-heading" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="holdings-heading"
            className="font-display text-xl font-semibold text-slate-900"
          >
            Holdings
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Filter by asset class and sort by the signal that matters for the
            morning review.
          </p>
        </div>
        <label className="flex flex-col gap-1 text-sm text-slate-700">
          <span className="font-medium">Sort by</span>
          <select
            className="min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="weightPct">Weight</option>
            <option value="marketValueUsd">Market value</option>
            <option value="dayChangePct">Day change</option>
            <option value="ytdReturnPct">YTD return</option>
          </select>
        </label>
      </div>

      <div
        role="group"
        aria-label="Filter holdings by asset class"
        className="flex flex-wrap gap-2"
      >
        {FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(item.id)}
              className={`min-h-10 rounded-md px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
                active
                  ? "bg-teal-800 text-white"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            Portfolio holdings with market value, weight, and returns
          </caption>
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Name
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Asset class
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Region
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">
                Market value
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">
                Weight
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">
                Day
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-right">
                YTD
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-600"
                >
                  No holdings match this filter.
                </td>
              </tr>
            ) : (
              rows.map((holding) => (
                <tr
                  key={holding.id}
                  className="border-t border-slate-100 hover:bg-slate-50/80"
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-slate-900"
                  >
                    <div>{holding.name}</div>
                    <div className="text-xs font-normal text-slate-500">
                      {holding.ticker}
                    </div>
                  </th>
                  <td className="px-4 py-3 text-slate-700">
                    {assetClassLabel(holding.assetClass)}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{holding.region}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-800">
                    {formatUsdCompact(holding.marketValueUsd)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-800">
                    {holding.weightPct.toFixed(1)}%
                  </td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums ${
                      holding.dayChangePct >= 0
                        ? "text-emerald-700"
                        : "text-rose-700"
                    }`}
                  >
                    {formatPct(holding.dayChangePct)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right tabular-nums ${
                      holding.ytdReturnPct >= 0
                        ? "text-emerald-700"
                        : "text-rose-700"
                    }`}
                  >
                    {formatPct(holding.ytdReturnPct, 1)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
