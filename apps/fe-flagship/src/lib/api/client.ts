import type { ApiErrorBody, PortfolioSnapshot } from "@/lib/types";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = {
  signal?: AbortSignal;
  baseUrl?: string;
};

async function parseJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T | ApiErrorBody;
  if (!response.ok) {
    const err = body as ApiErrorBody;
    throw new ApiError(
      err.error ?? "Request failed",
      response.status,
      err.code ?? "unknown",
    );
  }
  return body as T;
}

/**
 * Typed API surface for Meridian Insights.
 * Components depend on this module — not raw fetch — so transports
 * (Next route handlers, BFF, or external APIs) can swap without UI churn.
 */
export const api = {
  async getPortfolioSnapshot(
    options: RequestOptions = {},
  ): Promise<PortfolioSnapshot> {
    const base = options.baseUrl ?? "";
    const response = await fetch(`${base}/api/portfolio`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: options.signal,
      cache: "no-store",
    });
    return parseJson<PortfolioSnapshot>(response);
  },
};
