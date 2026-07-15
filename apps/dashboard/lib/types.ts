export const workflowStatuses = [
  "backlog",
  "selected",
  "scripting",
  "prompts_ready",
  "assets_ready",
  "editing",
  "ready_to_publish",
  "published",
  "analyzed",
  "discarded",
] as const;

export type WorkflowStatus = (typeof workflowStatuses)[number];

export const assetTypes = ["image", "video", "audio", "other"] as const;
export const assetStatuses = ["planned", "ready", "approved", "rejected"] as const;

export type AssetType = (typeof assetTypes)[number];
export type AssetStatus = (typeof assetStatuses)[number];

export type SceneAsset = {
  id: number;
  visual_prompt_id: number;
  name: string;
  asset_type: AssetType;
  file_path: string;
  source: string | null;
  status: AssetStatus;
  notes: string | null;
  created_at: string;
};

export type VisualPrompt = {
  id: number;
  script_id: number;
  scene_number: number;
  scene_description: string;
  prompt_text: string;
  created_at: string;
  assets: SceneAsset[];
};

export type Script = {
  id: number;
  idea_id: number;
  full_script: string;
  duration_target_seconds: number;
  final_question: string | null;
  created_at: string;
  visual_prompts: VisualPrompt[];
};

export type Idea = {
  id: number;
  title: string;
  concept: string;
  niche: string;
  status: WorkflowStatus;
  hook: string | null;
  created_at: string;
  updated_at: string;
  script?: Script | null;
};

export type VideoMetric = {
  id: number;
  video_id: number;
  video_title?: string;
  views: number;
  likes: number;
  comments: number;
  subscribers_gained: number;
  average_view_duration: number | null;
  retention_percentage: number | null;
  checked_at: string;
};

export type Video = {
  id: number;
  idea_id: number;
  title: string;
  youtube_url: string | null;
  local_file_path: string | null;
  status: WorkflowStatus;
  publish_date: string | null;
  created_at: string;
  metrics: VideoMetric[];
};

export type DashboardSummary = {
  total_ideas: number;
  active_ideas: number;
  produced_videos: number;
  published_videos: number;
  total_views: number;
};
