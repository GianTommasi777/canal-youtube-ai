import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { formatNumber } from "@/lib/format";
import { getIdeas, getSummary } from "@/lib/api";

export default async function Home() {
  const [summary, ideas] = await Promise.all([getSummary(), getIdeas()]);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Production control / v0.1"
        title="Tu canal, de la idea al análisis."
        description="Un centro de operaciones local para convertir conceptos en vídeos, mantener el proceso visible y aprender de cada publicación."
        action={
          <Link
            href="/ideas"
            className="rounded-lg border border-acid/30 bg-acid/[0.06] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-acid"
          >
            Abrir pipeline
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Ideas totales" value={summary.total_ideas} detail="Biblioteca creativa" />
        <StatCard label="En proceso" value={summary.active_ideas} detail="Pipeline activo" accent />
        <StatCard label="Producidos" value={summary.produced_videos} detail="Renders registrados" />
        <StatCard label="Publicados" value={summary.published_videos} detail="En YouTube" />
        <StatCard label="Vistas" value={formatNumber(summary.total_views)} detail="Última lectura manual" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-xl border border-line bg-panel">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-sm font-medium text-white">Actividad creativa</h2>
            <Link href="/ideas" className="text-xs text-acid">Ver todas →</Link>
          </div>
          <div className="divide-y divide-line">
            {ideas.slice(0, 4).map((idea) => (
              <Link
                href={`/ideas/${idea.id}`}
                key={idea.id}
                className="grid gap-3 px-5 py-4 transition hover:bg-white/[0.02] md:grid-cols-[1fr_auto] md:items-center"
              >
                <div>
                  <p className="font-medium text-slate-200">{idea.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{idea.niche}</p>
                </div>
                <StatusBadge status={idea.status} />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-gradient-to-b from-cyan/[0.06] to-panel p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">Siguiente foco</p>
          <h2 className="mt-4 text-xl font-semibold text-white">Termina una pieza antes de abrir tres más.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Lleva una idea hasta <span className="text-cyan">ready_to_publish</span> para validar el flujo completo.
          </p>
          <div className="mt-8 h-1 overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-cyan to-acid" />
          </div>
          <p className="mt-3 text-xs text-slate-500">MVP · 3 de 5 bloques listos</p>
        </div>
      </section>
    </div>
  );
}
