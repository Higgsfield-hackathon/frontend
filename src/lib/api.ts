export const API_URL = import.meta.env.VITE_API_URL as string;
const API_TOKEN = import.meta.env.VITE_API_TOKEN as string;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Authorization": `Bearer ${API_TOKEN}`,
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function t2i(prompt: string, aspect_ratio = "4:3") {
  return http<{ id: string; status: string }>("/t2i", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, aspect_ratio }),
  });
}

export async function t2v(params: {
  prompt: string;
  duration?: number;
  resolution?: string;
  aspect_ratio?: string;
  camera_fixed?: boolean;
}) {
  return http<{ id: string; status: string }>("/t2v", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: params.prompt,
      duration: params.duration ?? 5,
      resolution: params.resolution ?? "720",
      aspect_ratio: params.aspect_ratio ?? "16:9",
      camera_fixed: params.camera_fixed ?? false,
    }),
  });
}

export async function i2vUrl(params: {
  image_url: string;
  prompt?: string;
  duration?: number;
  enhance_prompt?: boolean;
}) {
  return http<{ id: string; status: string }>("/i2v/url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: params.image_url,
      prompt: params.prompt ?? "",
      duration: params.duration ?? 5,
      enhance_prompt: params.enhance_prompt ?? true,
    }),
  });
}

export async function i2vFile(file: File, opts?: { prompt?: string; duration?: number; enhance_prompt?: boolean }) {
  const fd = new FormData();
  fd.append("file", file);
  if (opts?.prompt) fd.append("prompt", opts.prompt);
  fd.append("duration", String(opts?.duration ?? 5));
  fd.append("enhance_prompt", String(opts?.enhance_prompt ?? true));
  return http<{ id: string; status: string }>("/i2v", {
    method: "POST",
    body: fd,
  });
}

export function getJob(id: string) {
  return http<any>(`/jobs/${id}`);
}

export function getJobResult(id: string) {
  return http<any>(`/jobs/${id}/result`);
}
