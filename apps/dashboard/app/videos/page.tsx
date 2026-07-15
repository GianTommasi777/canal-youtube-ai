import { CreateVideoForm } from "@/components/create-video-form";
import { PageHeader } from "@/components/page-header";
import { VideoStatusSelect } from "@/components/video-status-select";
import { formatDate } from "@/lib/format";
import { getIdeas, getVideos } from "@/lib/api";

export default async function VideosPage() {
  const [videos, ideas] = await Promise.all([getVideos(), getIdeas()]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Output library"
        title="Vídeos"
        description="Registro de renders producidos y publicaciones. La subida automática queda fuera de este MVP."
        action={<CreateVideoForm ideas={ideas} />}
      />

      <section className="overflow-hidden rounded-xl border border-line bg-panel">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b border-line font-mono text-[10px] uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-5 py-4 font-normal">Vídeo</th>
                <th className="px-5 py-4 font-normal">Estado</th>
                <th className="px-5 py-4 font-normal">Archivo local</th>
                <th className="px-5 py-4 font-normal">Publicación</th>
                <th className="px-5 py-4 font-normal">Enlace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-sm">
              {videos.map((video) => (
                <tr key={video.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-5 font-medium text-white">{video.title}</td>
                  <td className="px-5 py-5"><VideoStatusSelect videoId={video.id} initialStatus={video.status} /></td>
                  <td className="px-5 py-5 font-mono text-xs text-slate-500">
                    {video.local_file_path ?? "—"}
                  </td>
                  <td className="px-5 py-5 text-slate-400">{formatDate(video.publish_date)}</td>
                  <td className="px-5 py-5">
                    {video.youtube_url ? (
                      <a href={video.youtube_url} className="text-xs text-cyan" target="_blank">
                        Abrir ↗
                      </a>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
