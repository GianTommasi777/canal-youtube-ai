type StatCardProps = {
  label: string;
  value: string | number;
  detail: string;
  accent?: boolean;
};

export function StatCard({ label, value, detail, accent }: StatCardProps) {
  return (
    <article
      className={`rounded-xl border p-5 shadow-glow ${
        accent ? "border-acid/20 bg-acid/[0.04]" : "border-line bg-panel"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </article>
  );
}
