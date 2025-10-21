import { useState } from "react";

type TopAction = "A" | "B";

export default function App() {
  return (
    <div className="min-h-screen bg-brand-main text-brand-additional grid place-items-center p-3 sm:p-6">
      <Shell />
    </div>
  );
}

function Shell() {
  const [activeTop, setActiveTop] = useState<TopAction>("A");

  return (
    <div className="w-full max-w-[1400px] grid grid-cols-[78px,minmax(0,1fr)] gap-4 sm:gap-6">
      {/* LEFT RAIL */}
      <aside className="flex flex-col gap-3">
        {/* Logo + name */}
        <div className="glass rounded-[18px] h-[72px] flex items-center justify-center">
          <LogoMark />
        </div>

        {/* Nav cluster */}
        <div className="glass rounded-[18px] py-3 flex flex-col items-center gap-2">
          <RailBtn icon="home" />
          <RailBtn icon="star" />
          <RailBtn icon="pin" />
          <div className="h-px w-7 bg-white/10 my-1" />
          {/* Large round action */}
          <button
            className="size-11 rounded-full bg-brand-accent text-brand-main font-bold shadow-glow hover:scale-105 transition"
            aria-label="Primary action"
          >
            +
          </button>
        </div>

        {/* Secondary stack */}
        <div className="glass rounded-[18px] py-3 flex flex-col items-center gap-2 flex-1">
          <RailBtn icon="user" />
          <RailBtn icon="gear" />
          <RailBtn icon="help" />
        </div>
      </aside>

      {/* CENTER CANVAS */}
      <section className="relative">
        {/* BIG rounded canvas with notch cut */}
        <div className="relative rounded-[32px] bg-[#A9A9AF]/55 canvas-tex overflow-hidden">
          {/* top sculpted corners illusion */}
          <div className="absolute inset-x-0 -top-6 h-10 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]">
            {/* nothing needed; just spacing for notch */}
          </div>

          {/* Notch (dynamic island) */}
          <div className="absolute left-1/2 -top-4 -translate-x-1/2">
            <div className="pill px-2 py-1 flex items-center gap-2">
              <button
                onClick={() => setActiveTop("A")}
                className={`px-3 py-1 rounded-full text-xs ${
                  activeTop === "A"
                    ? "bg-brand-accent text-brand-main"
                    : "text-white/80"
                }`}
              >
                A
              </button>
              <button
                onClick={() => setActiveTop("B")}
                className={`px-3 py-1 rounded-full text-xs ${
                  activeTop === "B"
                    ? "bg-brand-accent text-brand-main"
                    : "text-white/80"
                }`}
              >
                B
              </button>
            </div>
          </div>

          {/* Top-right toolbar inside canvas */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <CanvasPill>Docs</CanvasPill>
            <CanvasPill>Models</CanvasPill>
            <CanvasPill variant="accent">Sign up →</CanvasPill>
          </div>

          {/* Bottom-left tiny user chip */}
          <div className="absolute left-5 bottom-5">
            <div className="pill px-3 py-1.5 text-xs flex items-center gap-2">
              <div className="size-4 rounded-full bg-white/30" />
              <span>@Hi-Geek</span>
            </div>
          </div>

          {/* Bottom-right info card with pads */}
          <div className="absolute right-4 bottom-4">
            <div className="relative">
              {/* bubble */}
              <div className="rounded-[24px] glass px-5 py-4 max-w-[320px]">
                <h3 className="text-[11px] tracking-[.12em] font-semibold">
                  UNLEASH THE POWER OF
                  <br />
                  PRECISION GAMING
                </h3>
                <p className="mt-1 text-xs opacity-80">
                  Next-gen controller designed for total immersion.
                </p>

                {/* 3 ghost pads */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="pad size-8" />
                  <div className="pad size-8" />
                  <div className="pad size-8" />
                </div>
              </div>

              {/* chevron button overlapping */}
              <button
                className="absolute -left-3 -bottom-3 size-10 rounded-full bg-brand-main border border-white/15 grid place-items-center"
                aria-label="Go"
              >
                <ArrowIcon />
              </button>
            </div>
          </div>

          {/* Aspect spacer */}
          <div className="pt-[52%]" />
        </div>
      </section>
    </div>
  );
}

/* --- tiny components --- */

function CanvasPill({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant?: "accent";
}) {
  if (variant === "accent") {
    return (
      <button className="pill bg-brand-accent text-brand-main shadow-glow px-4 py-1.5 text-xs font-semibold hover:scale-[1.02] transition">
        {children}
      </button>
    );
  }
  return (
    <button className="pill px-4 py-1.5 text-xs hover:border-white/25 transition">
      {children}
    </button>
  );
}

function RailBtn({
  icon,
}: {
  icon: "home" | "star" | "pin" | "user" | "gear" | "help";
}) {
  return (
    <button
      className="size-10 rounded-xl hover:bg-white/10 grid place-items-center transition"
      aria-label={icon}
      title={icon}
    >
      <DotIcon />
    </button>
  );
}

function LogoMark() {
  return (
    <div className="flex items-center gap-2">
      <div className="size-8 rounded-full bg-brand-accent shadow-glow" />
      <span className="font-semibold tracking-tight">Higgsfield</span>
    </div>
  );
}

function DotIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-80">
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      className="text-brand-accent"
    >
      <path
        d="M7 17l7-7M14 10h-5m5 0v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
