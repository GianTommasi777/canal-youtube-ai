"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { apiUrl } from "@/lib/api";
import { Video } from "@/lib/types";

const inputClass =
  "mt-2 w-full rounded-lg border border-line bg-ink p-3 text-sm normal-case tracking-normal text-white outline-none focus:border-acid/50";

export function CreateMetricForm({ videos }: { videos: Video[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const videoId = Number(form.get("video_id"));
    setMessage("Guardando lectura...");
    try {
      const response = await fetch(`${apiUrl}/videos/${videoId}/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          views: Number(form.get("views")),
          likes: Number(form.get("likes")),
          comments: Number(form.get("comments")),
          subscribers_gained: Number(form.get("subscribers_gained")),
          average_view_duration: optionalNumber(form.get("average_view_duration")),
          retention_percentage: optionalNumber(form.get("retention_percentage")),
        }),
      });
      if (!response.ok) throw new Error();
      formElement.reset();
      setOpen(false);
      setMessage("");
      router.refresh();
    } catch {
      setMessage("No se pudo registrar la lectura.");
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="rounded-lg bg-acid px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink">
        + Nueva lectura
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="w-full max-w-3xl rounded-2xl border border-line bg-panel p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-cyan">Manual analytics</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Registrar métricas</h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-500">Cerrar</button>
        </div>
        <label className="text-xs uppercase tracking-wider text-slate-500">
          Vídeo
          <select name="video_id" required className={inputClass}>
            {videos.map((video) => <option key={video.id} value={video.id}>{video.title}</option>)}
          </select>
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricField label="Vistas" name="views" required />
          <MetricField label="Likes" name="likes" required />
          <MetricField label="Comentarios" name="comments" required />
          <MetricField label="Suscriptores ganados" name="subscribers_gained" required />
          <MetricField label="Duración media (seg.)" name="average_view_duration" />
          <MetricField label="Retención (%)" name="retention_percentage" step="0.1" max="100" />
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-xs text-red-300/80">{message}</p>
          <button disabled={videos.length === 0} className="rounded-lg bg-acid px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink disabled:opacity-40">
            Guardar lectura
          </button>
        </div>
      </form>
    </div>
  );
}

function optionalNumber(value: FormDataEntryValue | null) {
  return value === null || value === "" ? null : Number(value);
}

function MetricField({ label, name, required = false, step = "1", max }: { label: string; name: string; required?: boolean; step?: string; max?: string }) {
  return (
    <label className="text-xs uppercase tracking-wider text-slate-500">
      {label}
      <input name={name} type="number" min="0" max={max} step={step} defaultValue={required ? "0" : ""} required={required} className={inputClass} />
    </label>
  );
}
