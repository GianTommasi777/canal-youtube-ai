"use client";

import Link from "next/link";
import { DragEvent, useMemo, useState } from "react";

import { apiUrl } from "@/lib/api";
import { formatDate, humanizeStatus } from "@/lib/format";
import { Idea, WorkflowStatus, workflowStatuses } from "@/lib/types";

export function IdeaKanban({ initialIdeas }: { initialIdeas: Idea[] }) {
  const [ideas, setIdeas] = useState(initialIdeas);
  const [message, setMessage] = useState("Arrastra una tarjeta para cambiar su estado.");
  const grouped = useMemo(
    () =>
      workflowStatuses.map((status) => ({
        status,
        ideas: ideas.filter((idea) => idea.status === status),
      })),
    [ideas],
  );

  function startDrag(event: DragEvent, ideaId: number) {
    event.dataTransfer.setData("text/plain", String(ideaId));
    event.dataTransfer.effectAllowed = "move";
  }

  async function moveIdea(event: DragEvent, status: WorkflowStatus) {
    event.preventDefault();
    const ideaId = Number(event.dataTransfer.getData("text/plain"));
    const current = ideas.find((idea) => idea.id === ideaId);
    if (!current || current.status === status) return;

    setIdeas((items) =>
      items.map((idea) => (idea.id === ideaId ? { ...idea, status } : idea)),
    );
    setMessage(`Moviendo “${current.title}” a ${humanizeStatus(status)}...`);

    try {
      const response = await fetch(`${apiUrl}/ideas/${ideaId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error();
      setMessage("Estado actualizado.");
    } catch {
      setIdeas((items) =>
        items.map((idea) =>
          idea.id === ideaId ? { ...idea, status: current.status } : idea,
        ),
      );
      setMessage("No se pudo actualizar. Comprueba que la API esté activa.");
    }
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500">{message}</p>
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
          {ideas.length} ideas
        </span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-5">
        {grouped.map((column) => (
          <div
            key={column.status}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => moveIdea(event, column.status)}
            className="min-h-[420px] w-[280px] min-w-[280px] rounded-xl border border-line bg-panel/70 p-3"
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                {humanizeStatus(column.status)}
              </h2>
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/5 px-1 text-[10px] text-slate-500">
                {column.ideas.length}
              </span>
            </div>
            <div className="space-y-3">
              {column.ideas.map((idea) => (
                <article
                  draggable
                  onDragStart={(event) => startDrag(event, idea.id)}
                  key={idea.id}
                  className="cursor-grab rounded-lg border border-line bg-ink p-4 transition hover:border-acid/30 active:cursor-grabbing"
                >
                  <Link href={`/ideas/${idea.id}`} className="block">
                    <p className="font-medium leading-5 text-slate-200 hover:text-acid">
                      {idea.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                      {idea.concept}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-[10px] text-cyan">{idea.niche}</span>
                      <span className="font-mono text-[9px] text-slate-700">
                        {formatDate(idea.updated_at)}
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
              {column.ideas.length === 0 && (
                <div className="grid h-24 place-items-center rounded-lg border border-dashed border-line text-[10px] uppercase tracking-wider text-slate-700">
                  Suelta aquí
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
