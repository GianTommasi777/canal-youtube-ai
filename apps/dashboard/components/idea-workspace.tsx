"use client";

import { FormEvent, useState } from "react";

import { apiUrl } from "@/lib/api";
import { formatDuration } from "@/lib/format";
import { Idea, Script, VisualPrompt } from "@/lib/types";
import { SceneAssets } from "@/components/scene-assets";

const inputClass =
  "mt-2 w-full rounded-lg border border-line bg-ink p-3 text-sm normal-case tracking-normal text-white outline-none focus:border-acid/50";

export function IdeaWorkspace({ initialIdea }: { initialIdea: Idea }) {
  const [idea, setIdea] = useState(initialIdea);
  const [message, setMessage] = useState("Todos los cambios se guardan en la API local.");

  async function saveIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage("Guardando datos editoriales...");
    const payload = {
      title: form.get("title"),
      niche: form.get("niche"),
      hook: form.get("hook") || null,
      concept: form.get("concept"),
    };
    try {
      const response = await fetch(`${apiUrl}/ideas/${idea.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error();
      const updated = (await response.json()) as Idea;
      setIdea((current) => ({ ...current, ...updated }));
      setMessage("Datos de la idea guardados.");
    } catch {
      setMessage("No se pudo guardar la idea. Comprueba la API.");
    }
  }

  async function saveScript(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      full_script: form.get("full_script"),
      duration_target_seconds: Number(form.get("duration_target_seconds")),
      final_question: form.get("final_question") || null,
    };
    const existing = idea.script;
    const path = existing ? `/scripts/${existing.id}` : `/ideas/${idea.id}/scripts`;
    setMessage(existing ? "Actualizando guion..." : "Creando guion...");
    try {
      const response = await fetch(`${apiUrl}${path}`, {
        method: existing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error();
      const script = (await response.json()) as Script;
      setIdea((current) => ({ ...current, script }));
      setMessage("Guion guardado.");
    } catch {
      setMessage("No se pudo guardar el guion.");
    }
  }

  async function addPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!idea.script) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      scene_number: Number(form.get("scene_number")),
      scene_description: form.get("scene_description"),
      prompt_text: form.get("prompt_text"),
    };
    setMessage("Añadiendo escena...");
    try {
      const response = await fetch(
        `${apiUrl}/scripts/${idea.script.id}/visual-prompts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) throw new Error();
      const prompt = (await response.json()) as VisualPrompt;
      setIdea((current) => ({
        ...current,
        script: current.script
          ? {
              ...current.script,
              visual_prompts: [...current.script.visual_prompts, prompt].sort(
                (a, b) => a.scene_number - b.scene_number,
              ),
            }
          : null,
      }));
      formElement.reset();
      setMessage("Escena añadida.");
    } catch {
      setMessage("No se pudo añadir la escena.");
    }
  }

  function updatePrompt(prompt: VisualPrompt) {
    setIdea((current) => ({
      ...current,
      script: current.script
        ? {
            ...current.script,
            visual_prompts: current.script.visual_prompts.map((item) =>
              item.id === prompt.id ? prompt : item,
            ),
          }
        : null,
    }));
    setMessage("Escena actualizada.");
  }

  function removePrompt(promptId: number) {
    setIdea((current) => ({
      ...current,
      script: current.script
        ? {
            ...current.script,
            visual_prompts: current.script.visual_prompts.filter(
              (item) => item.id !== promptId,
            ),
          }
        : null,
    }));
    setMessage("Escena eliminada.");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan/15 bg-cyan/[0.03] px-4 py-3 text-xs text-slate-400">
        {message}
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={saveIdea} className="rounded-xl border border-line bg-panel p-6">
          <SectionTitle eyebrow="Ficha editorial" title="Idea y posicionamiento" />
          <div className="mt-6 space-y-4">
            <Field label="Título" name="title" defaultValue={idea.title} required />
            <Field label="Nicho" name="niche" defaultValue={idea.niche} required />
            <Field label="Hook" name="hook" defaultValue={idea.hook ?? ""} />
            <label className="block text-xs uppercase tracking-wider text-slate-500">
              Concepto
              <textarea
                name="concept"
                defaultValue={idea.concept}
                required
                rows={5}
                className={inputClass}
              />
            </label>
          </div>
          <SubmitButton>Guardar idea</SubmitButton>
        </form>

        <form onSubmit={saveScript} className="rounded-xl border border-line bg-panel p-6">
          <div className="flex items-start justify-between gap-4">
            <SectionTitle eyebrow="Narrativa" title="Guion maestro" />
            <span className="font-mono text-[10px] text-slate-600">
              {formatDuration(idea.script?.duration_target_seconds ?? null)}
            </span>
          </div>
          <div className="mt-6 space-y-4">
            <label className="block text-xs uppercase tracking-wider text-slate-500">
              Guion completo
              <textarea
                name="full_script"
                defaultValue={idea.script?.full_script ?? ""}
                required
                minLength={20}
                rows={14}
                className={inputClass}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-[180px_1fr]">
              <Field
                label="Duración (segundos)"
                name="duration_target_seconds"
                type="number"
                defaultValue={String(idea.script?.duration_target_seconds ?? 180)}
                required
              />
              <Field
                label="Pregunta final"
                name="final_question"
                defaultValue={idea.script?.final_question ?? ""}
              />
            </div>
          </div>
          <SubmitButton>{idea.script ? "Actualizar guion" : "Crear guion"}</SubmitButton>
        </form>
      </section>

      <section className="rounded-xl border border-line bg-panel p-6">
        <div className="flex items-center justify-between gap-4">
          <SectionTitle eyebrow="Visual development" title="Escenas y prompts" />
          <span className="text-xs text-slate-500">
            {idea.script?.visual_prompts.length ?? 0} escenas
          </span>
        </div>

        {idea.script ? (
          <>
            <form
              onSubmit={addPrompt}
              className="mt-6 grid gap-4 rounded-xl border border-line bg-ink p-4 lg:grid-cols-[100px_1fr_1.4fr_auto] lg:items-end"
            >
              <Field label="Escena" name="scene_number" type="number" defaultValue={String((idea.script.visual_prompts.at(-1)?.scene_number ?? 0) + 1)} required />
              <Field label="Descripción" name="scene_description" required />
              <Field label="Prompt visual" name="prompt_text" required />
              <button className="h-[42px] rounded-lg bg-cyan px-4 text-xs font-bold uppercase tracking-wider text-ink">
                Añadir
              </button>
            </form>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {idea.script.visual_prompts.map((prompt) => (
                <PromptEditor
                  key={prompt.id}
                  prompt={prompt}
                  onUpdate={updatePrompt}
                  onRemove={removePrompt}
                  onMessage={setMessage}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="mt-5 rounded-lg border border-dashed border-line p-6 text-sm text-slate-500">
            Guarda primero el guion para empezar a definir escenas.
          </p>
        )}
      </section>
    </div>
  );
}

function PromptEditor({
  prompt,
  onUpdate,
  onRemove,
  onMessage,
}: {
  prompt: VisualPrompt;
  onUpdate: (prompt: VisualPrompt) => void;
  onRemove: (promptId: number) => void;
  onMessage: (message: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const response = await fetch(`${apiUrl}/scripts/visual-prompts/${prompt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scene_number: Number(form.get("scene_number")),
          scene_description: form.get("scene_description"),
          prompt_text: form.get("prompt_text"),
        }),
      });
      if (!response.ok) throw new Error();
      onUpdate((await response.json()) as VisualPrompt);
    } catch {
      onMessage("No se pudo modificar la escena.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("¿Eliminar esta escena?")) return;
    setBusy(true);
    try {
      const response = await fetch(`${apiUrl}/scripts/visual-prompts/${prompt.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      onRemove(prompt.id);
    } catch {
      onMessage("No se pudo eliminar la escena.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-line bg-ink p-4">
      <form onSubmit={save}>
      <div className="grid gap-3 sm:grid-cols-[90px_1fr]">
        <Field label="Escena" name="scene_number" type="number" defaultValue={String(prompt.scene_number)} required />
        <Field label="Descripción" name="scene_description" defaultValue={prompt.scene_description} required />
      </div>
      <label className="mt-3 block text-xs uppercase tracking-wider text-slate-500">
        Prompt
        <textarea name="prompt_text" defaultValue={prompt.prompt_text} rows={3} required className={inputClass} />
      </label>
      <div className="mt-4 flex justify-between">
        <button type="button" onClick={remove} disabled={busy} className="text-xs text-red-300/70 hover:text-red-300">
          Eliminar
        </button>
        <button disabled={busy} className="rounded-md border border-cyan/30 px-3 py-2 text-[10px] uppercase tracking-wider text-cyan">
          {busy ? "Guardando..." : "Guardar escena"}
        </button>
      </div>
      </form>
      <SceneAssets
        promptId={prompt.id}
        initialAssets={prompt.assets}
        onMessage={onMessage}
      />
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">{eyebrow}</p>
      <h2 className="mt-2 text-lg font-semibold text-white">{title}</h2>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue = "",
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-xs uppercase tracking-wider text-slate-500">
      {label}
      <input name={name} type={type} defaultValue={defaultValue} required={required} min={type === "number" ? 1 : undefined} className={inputClass} />
    </label>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="mt-6 rounded-lg bg-acid px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-white">
      {children}
    </button>
  );
}
