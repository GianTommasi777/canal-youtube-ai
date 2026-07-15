"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { apiUrl } from "@/lib/api";

export function CreateIdeaForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Guardando...");
    const form = new FormData(event.currentTarget);
    const payload = {
      title: form.get("title"),
      concept: form.get("concept"),
      niche: form.get("niche"),
      hook: form.get("hook") || null,
      status: "backlog",
    };

    try {
      const response = await fetch(`${apiUrl}/ideas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("No se pudo guardar");
      event.currentTarget.reset();
      setMessage("Idea creada");
      setOpen(false);
      router.refresh();
    } catch {
      setMessage("Inicia la API para crear ideas reales.");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-acid px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-white"
      >
        + Nueva idea
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="w-full max-w-xl rounded-2xl border border-line bg-panel p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Nueva idea</h2>
          <button type="button" onClick={() => setOpen(false)} className="text-slate-500">
            Cerrar
          </button>
        </div>
        <div className="space-y-4">
          <Field label="Título" name="title" required />
          <Field label="Nicho" name="niche" required />
          <Field label="Hook inicial" name="hook" />
          <label className="block text-xs uppercase tracking-wider text-slate-500">
            Concepto
            <textarea
              name="concept"
              required
              rows={4}
              className="mt-2 w-full rounded-lg border border-line bg-ink p-3 text-sm normal-case tracking-normal text-white outline-none focus:border-acid/50"
            />
          </label>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500">{message}</p>
          <button className="rounded-lg bg-acid px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink">
            Guardar idea
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  required = false,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="block text-xs uppercase tracking-wider text-slate-500">
      {label}
      <input
        name={name}
        required={required}
        className="mt-2 w-full rounded-lg border border-line bg-ink p-3 text-sm normal-case tracking-normal text-white outline-none focus:border-acid/50"
      />
    </label>
  );
}
