"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiUrl } from "@/lib/api";
import { humanizeStatus } from "@/lib/format";
import { workflowStatuses, WorkflowStatus } from "@/lib/types";

export function StatusSelect({
  ideaId,
  initialStatus,
}: {
  ideaId: number;
  initialStatus: WorkflowStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);

  async function update(nextStatus: WorkflowStatus) {
    setStatus(nextStatus);
    setSaving(true);
    try {
      await fetch(`${apiUrl}/ideas/${ideaId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <label className="text-xs uppercase tracking-wider text-slate-500">
      Estado {saving && "· guardando"}
      <select
        value={status}
        onChange={(event) => update(event.target.value as WorkflowStatus)}
        className="mt-2 block w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-sm normal-case tracking-normal text-white outline-none focus:border-acid/50"
      >
        {workflowStatuses.map((item) => (
          <option value={item} key={item}>
            {humanizeStatus(item)}
          </option>
        ))}
      </select>
    </label>
  );
}
