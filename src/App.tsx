import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-brand-main text-brand-additional grid place-items-center p-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Hello <span className="text-brand-accent">Higgsfield</span> 👋
        </h1>

        <p className="mt-3 opacity-80">
          Vite + React + <span className="text-brand-accent">Tailwind</span> is
          live.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setCount((n) => n + 1)}
            className="rounded-xl bg-brand-accent px-5 py-3 text-brand-main font-semibold shadow-glow hover:scale-105 transition"
          >
            count is {count}
          </button>

          <a
            href="https://tailwindcss.com/docs"
            className="rounded-xl border border-white/15 px-5 py-3 hover:border-brand-accent/60 transition"
            target="_blank"
            rel="noreferrer"
          >
            Tailwind Docs
          </a>
        </div>

        <p className="mt-6 text-sm opacity-70">
          Edit <code className="text-brand-accent">src/App.tsx</code> and save
          to test HMR
        </p>
      </div>
    </div>
  );
}
