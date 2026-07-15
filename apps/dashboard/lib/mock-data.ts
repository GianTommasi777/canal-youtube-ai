import { DashboardSummary, Idea, Video, VideoMetric } from "./types";

const now = "2026-06-14T18:00:00Z";

export const mockIdeas: Idea[] = [
  {
    id: 1,
    title: "La ciudad que duerme bajo el hielo",
    concept: "Documental breve sobre una ciudad ficticia preservada bajo un glaciar.",
    niche: "Historia especulativa",
    status: "prompts_ready",
    hook: "En 2147, el hielo devolvió una ciudad que nadie recordaba.",
    created_at: now,
    updated_at: now,
    script: {
      id: 1,
      idea_id: 1,
      full_script:
        "En 2147, un equipo de climatólogos detectó líneas imposibles bajo el hielo. No eran grietas: eran avenidas. La expedición reveló una ciudad completa, silenciosa y preservada.",
      duration_target_seconds: 180,
      final_question: "¿Qué historia crees que quedó congelada allí?",
      created_at: now,
      visual_prompts: [
        {
          id: 1,
          script_id: 1,
          scene_number: 1,
          scene_description: "Plano aéreo del glaciar al amanecer.",
          prompt_text: "Cinematic aerial glacier, blue hour, hidden geometric lines, 16:9",
          created_at: now,
          assets: [],
        },
        {
          id: 2,
          script_id: 1,
          scene_number: 2,
          scene_description: "La expedición encuentra una avenida congelada.",
          prompt_text: "Explorers above an ancient frozen avenue, volumetric light, cinematic",
          created_at: now,
          assets: [],
        },
      ],
    },
  },
  {
    id: 2,
    title: "7 tecnologías que parecían magia",
    concept: "Inventos cotidianos anticipados por la ciencia ficción.",
    niche: "Tecnología",
    status: "selected",
    hook: "Tu teléfono habría sido evidencia de brujería hace apenas dos siglos.",
    created_at: now,
    updated_at: now,
  },
  {
    id: 3,
    title: "Por qué soñamos con Marte",
    concept: "Ensayo sobre la fascinación cultural y científica por Marte.",
    niche: "Espacio",
    status: "backlog",
    hook: "Antes de pisar Marte, llevamos siglos inventándolo.",
    created_at: now,
    updated_at: now,
  },
];

export const mockMetrics: VideoMetric[] = [
  {
    id: 1,
    video_id: 1,
    video_title: "La ciudad que duerme bajo el hielo",
    views: 12480,
    likes: 934,
    comments: 87,
    subscribers_gained: 146,
    average_view_duration: 132,
    retention_percentage: 73.4,
    checked_at: now,
  },
];

export const mockVideos: Video[] = [
  {
    id: 1,
    idea_id: 1,
    title: "La ciudad que duerme bajo el hielo",
    youtube_url: "https://youtube.com/watch?v=demo",
    local_file_path: "content/renders/ciudad-bajo-el-hielo.mp4",
    status: "published",
    publish_date: "2026-06-14",
    created_at: now,
    metrics: mockMetrics,
  },
];

export const mockSummary: DashboardSummary = {
  total_ideas: 3,
  active_ideas: 2,
  produced_videos: 1,
  published_videos: 1,
  total_views: 12480,
};
