import { useEffect, useRef, useState } from "react";
import { getJob } from "../lib/api";

export function usePollJob(jobId: string | null, intervalMs = 2000) {
  const [status, setStatus] = useState<
    "idle" | "queued" | "running" | "completed" | "failed"
  >("idle");
  const [data, setData] = useState<any>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!jobId) return;
    setStatus("queued");
    const tick = async () => {
      try {
        const res = await getJob(jobId);
        setData(res);
        const s = (res?.status || res?.payload?.status || "").toLowerCase();
        if (s.includes("completed")) {
          setStatus("completed");
          if (timer.current) window.clearInterval(timer.current);
          timer.current = null;
        } else if (s.includes("failed")) {
          setStatus("failed");
          if (timer.current) window.clearInterval(timer.current);
          timer.current = null;
        } else {
          setStatus((s as any) || "running");
        }
      } catch (e) {
        setStatus("failed");
        if (timer.current) window.clearInterval(timer.current);
        timer.current = null;
      }
    };
    tick();
    timer.current = window.setInterval(tick, intervalMs);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [jobId, intervalMs]);

  return { status, data };
}
