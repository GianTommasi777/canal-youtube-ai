"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { apiUrl } from "@/lib/api";
import { humanizeStatus } from "@/lib/format";
import { Idea, workflowStatuses } from "@/lib/types";

const inputClass =
  "mt-2 w-full rounded-lg border border-line bg-ink p-3 text-sm normal-case tracking-normal text-white outline-none focus:border-acid/50";

export function CreateVideoForm({ ideas }: { ideas: Idea[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setMessage("Guardando vídeo...");
    try {
      const response = await fetch(`${apiUrl}/videos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea_id: Number(form.get("idea_id")),
          title: form.get("title"),
          local_file_path: form.get("local_file_path") || null,
          youtube_url: form.get("youtube_url") || null,
          status: form.get("status"),
          publish_date: form.get("publish_date") || null,
        }),
      });
      if (!response.ok) throw new Error();
      formElement.reset();
      setOpen(false);
      setMessage("");
      router.refresh();
    } catch {
      setMessage("No se pudo registrar. Comprueba la API.");
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="rounded-lg bg-acid px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink">
        + Registrar vídeo
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="w-full max-w-2xl rounded-2xl border border-line bg-panel p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-acid">Output registry</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Registrar vídeo</h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-500">Cerrar</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-xs uppercase tracking-wider text-slate-500 md:col-span-2">
            Idea asociada
            <select name="idea_id" required className={inputClass}>
              {ideas.map((idea) => <option key={idea.id} value={idea.id}>{idea.title}</option>)}
            </select>
          </label>
          <Field label="Título del vídeo" name="title" required />
          <label className="text-xs uppercase tracking-wider text-slate-500">
            Estado
            <select name="status" defaultValue="editing" className={inputClass}>
              {workflowStatuses.map((status) => <option value={status} key={status}>{humanizeStatus(status)}</option>)}
            </select>
          </label>
          <Field label="Ruta del render" name="local_file_path" placeholder="content/renders/video.mp4" />
          <Field label="URL de YouTube" name="youtube_url" placeholder="https://youtube.com/..." />
          <Field label="Fecha de publicación" name="publish_date" type="date" />
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-xs text-red-300/80">{message}</p>
          <button disabled={ideas.length === 0} className="rounded-lg bg-acid px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink disabled:opacity-40">
            Guardar vídeo
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", required = false, placeholder = "" }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="text-xs uppercase tracking-wider text-slate-500">
      {label}
      <input name={name} type={type} required={required} placeholder={placeholder} className={inputClass} />
    </label>
  );
}
