from enum import Enum


class WorkflowStatus(str, Enum):
    backlog = "backlog"
    selected = "selected"
    scripting = "scripting"
    prompts_ready = "prompts_ready"
    assets_ready = "assets_ready"
    editing = "editing"
    ready_to_publish = "ready_to_publish"
    published = "published"
    analyzed = "analyzed"
    discarded = "discarded"
