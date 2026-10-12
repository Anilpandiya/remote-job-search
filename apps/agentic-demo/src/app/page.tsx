import { AgentConsole } from "@/components/agent-console";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 lg:py-10">
      <header className="mb-8 border-b border-stone-300/70 pb-6">
        <p className="font-display text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Scout Loop
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
          A compact agentic product surface: the UI drives a server-side
          observe → plan → act → validate loop with mock tools and a clear
          OpenAI swap point.
        </p>
      </header>

      <main className="flex-1">
        <AgentConsole />
      </main>

      <footer className="mt-12 border-t border-stone-300/70 pt-6 text-xs text-stone-500">
        Agentic demo for Anil Kumar Pandiya — mock provider by default; no API
        key required.
      </footer>
    </div>
  );
}
