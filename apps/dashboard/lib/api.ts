import { mockIdeas, mockMetrics, mockSummary, mockVideos } from "./mock-data";
import { DashboardSummary, Idea, Video, VideoMetric } from "./types";

export const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const serverApiUrl = process.env.API_INTERNAL_URL ?? apiUrl;
    const response = await fetch(`${serverApiUrl}${path}`, { cache: "no-store" });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export const getSummary = () =>
  safeFetch<DashboardSummary>("/dashboard/summary", mockSummary);

export const getIdeas = () => safeFetch<Idea[]>("/ideas", mockIdeas);

export const getIdea = (id: string) =>
  safeFetch<Idea | null>(
    `/ideas/${id}`,
    mockIdeas.find((idea) => idea.id === Number(id)) ?? null,
  );

export const getVideos = () => safeFetch<Video[]>("/videos", mockVideos);

export const getMetrics = () =>
  safeFetch<VideoMetric[]>("/metrics", mockMetrics);
