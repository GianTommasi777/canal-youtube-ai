import { CreateMetricForm } from "@/components/create-metric-form";
import { PageHeader } from "@/components/page-header";
import { formatDate, formatDuration, formatNumber } from "@/lib/format";
import { getMetrics, getVideos } from "@/lib/api";

export default async function MetricsPage() {
  const [metrics, videos] = await Promise.all([getMetrics(), getVideos()]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Manual analytics"
        title="Métricas"
        description="Lecturas manuales para detectar señales tempranas. La integración con YouTube Analytics llegará después."
        action={<CreateMetricForm videos={videos} />}
      />

      <section className="overflow-hidden rounded-xl border border-line bg-panel">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="border-b border-line font-mono text-[10px] uppercase tracking-wider text-slate-600">
              <tr>
                {["Vídeo", "Vistas", "Likes", "Comentarios", "Suscriptores", "Duración media", "Retención", "Lectura"].map((label) => (
                  <th key={label} className="px-4 py-4 font-normal">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-sm">
              {metrics.map((metric) => (
                <tr key={metric.id} className="hover:bg-white/[0.02]">
                  <td className="max-w-xs px-4 py-5 font-medium text-white">{metric.video_title}</td>
                  <td className="px-4 py-5 text-acid">{formatNumber(metric.views)}</td>
                  <td className="px-4 py-5 text-slate-300">{formatNumber(metric.likes)}</td>
                  <td className="px-4 py-5 text-slate-300">{metric.comments}</td>
                  <td className="px-4 py-5 text-cyan">+{metric.subscribers_gained}</td>
                  <td className="px-4 py-5 text-slate-300">{formatDuration(metric.average_view_duration)}</td>
                  <td className="px-4 py-5 text-slate-300">{metric.retention_percentage ?? "—"}%</td>
                  <td className="px-4 py-5 text-xs text-slate-500">{formatDate(metric.checked_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
