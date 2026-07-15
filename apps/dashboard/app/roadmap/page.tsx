import { PageHeader } from "@/components/page-header";

const stages = [
  {
    phase: "Fase 01",
    title: "Control editorial",
    status: "EN CURSO",
    items: ["Ideas y estados", "Guiones", "Prompts visuales", "Métricas manuales"],
  },
  {
    phase: "Fase 02",
    title: "Producción asistida",
    status: "SIGUIENTE",
    items: ["Generación de voz", "Imágenes y vídeo IA", "Orquestación de assets", "Plantillas FFmpeg"],
  },
  {
    phase: "Fase 03",
    title: "Publicación",
    status: "PLANEADO",
    items: ["YouTube Data API", "Metadatos y miniaturas", "Calendario editorial", "Checklist de publicación"],
  },
  {
    phase: "Fase 04",
    title: "Optimización",
    status: "FUTURO",
    items: ["YouTube Analytics API", "Alertas de rendimiento", "Experimentos A/B", "Aprendizaje por nicho"],
  },
];

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="System evolution"
        title="Roadmap"
        description="Una progresión deliberada: primero control del proceso, después automatización con evidencia."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        {stages.map((stage, index) => (
          <article key={stage.phase} className="relative overflow-hidden rounded-xl border border-line bg-panel p-6">
            <span className="absolute right-4 top-2 font-mono text-7xl font-black text-white/[0.025]">
              {index + 1}
            </span>
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan">{stage.phase}</p>
              <span className={`font-mono text-[9px] tracking-wider ${index === 0 ? "text-acid" : "text-slate-600"}`}>
                {stage.status}
              </span>
            </div>
            <h2 className="mt-5 text-xl font-semibold text-white">{stage.title}</h2>
            <ul className="mt-5 space-y-3">
              {stage.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-400">
                  <span className={`h-1.5 w-1.5 rounded-full ${index === 0 ? "bg-acid" : "bg-slate-700"}`} />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}
