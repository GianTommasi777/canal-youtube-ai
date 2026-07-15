from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_ideas: int
    active_ideas: int
    produced_videos: int
    published_videos: int
    total_views: int
