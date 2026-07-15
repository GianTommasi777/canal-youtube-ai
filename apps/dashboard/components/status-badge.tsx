import { humanizeStatus } from "@/lib/format";

export function StatusBadge({ status }: { status: string }) {
  const active = !["backlog", "discarded"].includes(status);
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${
        active
          ? "border-acid/20 bg-acid/[0.06] text-acid"
          : "border-line bg-white/[0.02] text-slate-500"
      }`}
    >
      {humanizeStatus(status)}
    </span>
  );
}
