"use client";

import { useState } from "react";

import { apiUrl } from "@/lib/api";
import { humanizeStatus } from "@/lib/format";
import { WorkflowStatus, workflowStatuses } from "@/lib/types";

export function VideoStatusSelect({ videoId, initialStatus }: { videoId: number; initialStatus: WorkflowStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);

  async function update(nextStatus: WorkflowStatus) {
    const previous = status;
    setStatus(nextStatus);
    setSaving(true);
    try {
      const response = await fetch(`${apiUrl}/videos/${videoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) throw new Error();
    } catch {
      setStatus(previous);
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      aria-label="Estado del vídeo"
      value={status}
      disabled={saving}
      onChange={(event) => update(event.target.value as WorkflowStatus)}
      className="rounded-full border border-acid/20 bg-acid/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase text-acid outline-none"
    >
      {workflowStatuses.map((item) => <option value={item} key={item}>{humanizeStatus(item)}</option>)}
    </select>
  );
}
