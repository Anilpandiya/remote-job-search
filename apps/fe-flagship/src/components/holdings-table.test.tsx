import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HoldingsTable } from "@/components/holdings-table";
import type { Holding } from "@/lib/types";

const holdings: Holding[] = [
  {
    id: "1",
    name: "Alpha Equity",
    ticker: "AE",
    assetClass: "equity",
    region: "US",
    marketValueUsd: 1_000_000,
    weightPct: 50,
    dayChangePct: 1,
    ytdReturnPct: 10,
  },
  {
    id: "2",
    name: "Beta Bond",
    ticker: "BB",
    assetClass: "fixed_income",
    region: "US",
    marketValueUsd: 500_000,
    weightPct: 25,
    dayChangePct: -0.2,
    ytdReturnPct: 3,
  },
  {
    id: "3",
    name: "Cash Sleeve",
    ticker: "CASH",
    assetClass: "cash",
    region: "US",
    marketValueUsd: 500_000,
    weightPct: 25,
    dayChangePct: 0,
    ytdReturnPct: 4,
  },
];

describe("HoldingsTable", () => {
  it("filters holdings by asset class", async () => {
    const user = userEvent.setup();
    render(<HoldingsTable holdings={holdings} />);

    expect(screen.getByText("Alpha Equity")).toBeInTheDocument();
    expect(screen.getByText("Beta Bond")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Equity" }));

    expect(screen.getByText("Alpha Equity")).toBeInTheDocument();
    expect(screen.queryByText("Beta Bond")).not.toBeInTheDocument();
    expect(screen.queryByText("Cash Sleeve")).not.toBeInTheDocument();
  });

  it("exposes accessible table caption and filter group", () => {
    render(<HoldingsTable holdings={holdings} />);
    expect(
      screen.getByRole("group", { name: /filter holdings by asset class/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/portfolio holdings with market value/i),
    ).toBeInTheDocument();
  });
});
