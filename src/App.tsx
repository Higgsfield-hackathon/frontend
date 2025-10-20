import { useEffect, useState } from "react";
import { t2i, t2v, i2vUrl, i2vFile, getJobResult } from "./lib/api";
import { usePollJob } from "./hooks/usePollJob";

type Tab = "t2i" | "t2v" | "i2v";

export default function App() {
  const [tab, setTab] = useState<Tab>("t2i");

  return (
    <div className="min-h-screen bg-brand-main text-brand-additional p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Higgsfield <span className="text-brand-accent">Demo</span>
        </h1>
        <nav className="flex gap-2">
          {(["t2i", "t2v", "i2v"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl border border-white/10 hover:border-brand-accent/60 transition ${
                tab === t ? "bg-brand-accent text-brand-main shadow-glow" : ""
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto mt-8">
        {tab === "t2i" && <T2ISection />}
        {tab === "t2v" && <T2VSection />}
        {tab === "i2v" && <I2VSection />}
      </main>
    </div>
  );
}

/* ---------------- Result card (robust result extraction) ---------------- */

function ResultCard({
  jobId,
  kind,
}: {
  jobId: string;
  kind: "image" | "video";
}) {
  const { status } = usePollJob(jobId);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Extract a URL from many possible payload shapes
  function pickUrl(r: any): string | null {
    const val = (v: any): string | null =>
      typeof v === "string" ? v : v?.url ?? null;

    return (
      // flat
      val(r?.raw) ??
      val(r?.min) ??
      val(r?.results?.raw) ??
      val(r?.results?.min) ??
      // payload
      val(r?.payload?.raw) ??
      val(r?.payload?.min) ??
      val(r?.payload?.results?.raw) ??
      val(r?.payload?.results?.min) ??
      // payload.jobs[0]
      val(r?.payload?.jobs?.[0]?.results?.raw) ??
      val(r?.payload?.jobs?.[0]?.results?.min) ??
      // payload.payload.jobs[0]
      val(r?.payload?.payload?.jobs?.[0]?.results?.raw) ??
      val(r?.payload?.payload?.jobs?.[0]?.results?.min) ??
      // top-level jobs
      val(r?.jobs?.[0]?.results?.raw) ??
      val(r?.jobs?.[0]?.results?.min) ??
      null
    );
  }

  async function fetchResult() {
    try {
      setBusy(true);
      setErr(null);
      const r = await getJobResult(jobId);
      const url = pickUrl(r);

      if (!url) {
        console.debug("Result not ready or unknown shape:", r);
        throw new Error("Result URL not ready yet. Try again shortly.");
      }
      setFinalUrl(url);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to fetch result.");
    } finally {
      setBusy(false);
    }
  }

  // Auto-fetch as soon as job completes
  useEffect(() => {
    if (status === "completed" && !finalUrl && !busy) {
      fetchResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const waiting = status !== "completed";

  return (
    <div className="mt-6 rounded-2xl border border-white/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm truncate">
          Job: <code className="opacity-80">{jobId}</code>
        </div>
        <div className="text-sm">
          Status: <span className="text-brand-accent">{status}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={fetchResult}
          disabled={waiting || busy}
          className={`rounded-xl px-4 py-2 font-semibold transition ${
            waiting || busy
              ? "bg-white/10 border border-white/15 cursor-not-allowed"
              : "bg-brand-accent text-brand-main shadow-glow hover:scale-[1.02]"
          }`}
          title={
            waiting
              ? "Still running… will fetch automatically when ready"
              : "Fetch result"
          }
        >
          {busy ? "Fetching…" : waiting ? "Waiting…" : "Fetch Result"}
        </button>

        {err && <div className="text-red-400 text-sm">{err}</div>}
      </div>

      {finalUrl && kind === "image" && (
        <div className="mt-4">
          <img
            src={finalUrl}
            alt="result"
            className="rounded-xl max-h-[480px]"
          />
        </div>
      )}
      {finalUrl && kind === "video" && (
        <div className="mt-4">
          <video src={finalUrl} className="rounded-xl max-h-[480px]" controls />
        </div>
      )}
    </div>
  );
}

/* ------------------------------ T2I ------------------------------ */

function T2ISection() {
  const [prompt, setPrompt] = useState(
    "monkey wearing sunglasses, studio lighting"
  );
  const [ar, setAr] = useState("4:3");
  const [jobId, setJobId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await t2i(prompt, ar);
      setJobId(res.id);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h2 className="text-xl font-semibold">Text → Image</h2>
      <form
        onSubmit={onSubmit}
        className="mt-4 grid gap-3 sm:grid-cols-[1fr,200px,140px]"
      >
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Prompt"
          className="rounded-xl bg-black/40 border border-white/15 px-4 py-3 outline-none focus:border-brand-accent/60"
        />
        <select
          value={ar}
          onChange={(e) => setAr(e.target.value)}
          className="rounded-xl bg-black/40 border border-white/15 px-4 py-3"
        >
          {["1:1", "4:3", "16:9", "9:16"].map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <button
          disabled={busy}
          className="rounded-xl bg-brand-accent text-brand-main font-semibold shadow-glow px-4 py-3"
        >
          {busy ? "Submitting..." : "Generate"}
        </button>
      </form>

      {jobId && <ResultCard jobId={jobId} kind="image" />}
    </section>
  );
}

/* ------------------------------ T2V ------------------------------ */

function T2VSection() {
  const [prompt, setPrompt] = useState("Monkey dancing");
  const [duration, setDuration] = useState(5);
  const [ar, setAr] = useState("16:9");
  const [resolution, setResolution] = useState("720");
  const [jobId, setJobId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await t2v({
        prompt,
        duration,
        resolution,
        aspect_ratio: ar,
        camera_fixed: false,
      });
      setJobId(res.id);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h2 className="text-xl font-semibold">Text → Video</h2>
      <form
        onSubmit={onSubmit}
        className="mt-4 grid gap-3 sm:grid-cols-[1fr,120px,140px,140px,140px]"
      >
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="rounded-xl bg-black/40 border border-white/15 px-4 py-3"
        />
        <input
          type="number"
          min={1}
          max={10}
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="rounded-xl bg-black/40 border border-white/15 px-4 py-3"
          placeholder="Duration"
        />
        <select
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          className="rounded-xl bg-black/40 border border-white/15 px-4 py-3"
        >
          {["480", "720", "1080"].map((r) => (
            <option key={r} value={r}>
              {r}p
            </option>
          ))}
        </select>
        <select
          value={ar}
          onChange={(e) => setAr(e.target.value)}
          className="rounded-xl bg-black/40 border border-white/15 px-4 py-3"
        >
          {["16:9", "9:16", "1:1"].map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <button
          disabled={busy}
          className="rounded-xl bg-brand-accent text-brand-main font-semibold shadow-glow px-4 py-3"
        >
          {busy ? "Submitting..." : "Generate"}
        </button>
      </form>

      {jobId && <ResultCard jobId={jobId} kind="video" />}
    </section>
  );
}

/* ------------------------------ I2V ------------------------------ */

function I2VSection() {
  const [mode, setMode] = useState<"url" | "file">("url");
  const [imageUrl, setImageUrl] = useState(
    "https://picsum.photos/seed/cat/800/600"
  );
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("Cat watches with wet eyes...");
  const [duration, setDuration] = useState(5);
  const [jobId, setJobId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res =
        mode === "url"
          ? await i2vUrl({
              image_url: imageUrl,
              prompt,
              duration,
              enhance_prompt: true,
            })
          : file
          ? await i2vFile(file, { prompt, duration, enhance_prompt: true })
          : (() => {
              throw new Error("File required");
            })();
      setJobId(res.id);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h2 className="text-xl font-semibold">Image → Video</h2>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setMode("url")}
          className={`px-3 py-2 rounded-md border ${
            mode === "url"
              ? "bg-brand-accent text-brand-main shadow-glow"
              : "border-white/15"
          }`}
        >
          URL
        </button>
        <button
          onClick={() => setMode("file")}
          className={`px-3 py-2 rounded-md border ${
            mode === "file"
              ? "bg-brand-accent text-brand-main shadow-glow"
              : "border-white/15"
          }`}
        >
          File
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-4 grid gap-3 sm:grid-cols-[1fr,140px]"
      >
        {mode === "url" ? (
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="rounded-xl bg-black/40 border border-white/15 px-4 py-3"
          />
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="rounded-xl bg-black/40 border border-white/15 px-4 py-3"
          />
        )}

        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Prompt (optional)"
          className="rounded-xl bg-black/40 border border-white/15 px-4 py-3 sm:col-span-2"
        />
        <input
          type="number"
          min={1}
          max={10}
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="rounded-xl bg-black/40 border border-white/15 px-4 py-3"
        />
        <button
          disabled={busy}
          className="rounded-xl bg-brand-accent text-brand-main font-semibold shadow-glow px-4 py-3"
        >
          {busy ? "Submitting..." : "Generate"}
        </button>
      </form>

      {jobId && <ResultCard jobId={jobId} kind="video" />}
    </section>
  );
}
