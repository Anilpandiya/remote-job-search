import { describe, expect, it } from "vitest";
import { assetClassLabel, formatPct } from "@/lib/format";

describe("format helpers", () => {
  it("formats positive and negative percentages with signs", () => {
    expect(formatPct(1.25)).toBe("+1.25%");
    expect(formatPct(-0.5)).toBe("-0.50%");
    expect(formatPct(0)).toBe("0.00%");
  });

  it("humanizes asset class ids", () => {
    expect(assetClassLabel("private_equity")).toBe("Private Equity");
    expect(assetClassLabel("fixed_income")).toBe("Fixed Income");
  });
});
