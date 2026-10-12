import { PortfolioDashboard } from "@/components/portfolio-dashboard";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="mb-8 flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Meridian Insights
          </p>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">
            A senior-owned FinTech slice: typed API client, accessible holdings
            review, and explicit loading/error paths.
          </p>
        </div>
        <nav aria-label="Primary" className="text-sm text-slate-600">
          <ul className="flex gap-4">
            <li>
              <a
                className="font-medium text-teal-900 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
                href="#main"
              >
                Dashboard
              </a>
            </li>
            <li>
              <span className="rounded-md bg-teal-50 px-2 py-1 text-teal-900">
                Demo data
              </span>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main" className="flex-1">
        <PortfolioDashboard />
      </main>

      <footer className="mt-12 border-t border-slate-200/80 pt-6 text-xs text-slate-500">
        Portfolio flagship for Anil Kumar Pandiya — architecture demo, not
        investment advice.
      </footer>
    </div>
  );
}
