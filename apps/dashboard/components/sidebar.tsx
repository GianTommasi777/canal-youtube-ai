import Link from "next/link";

const navigation = [
  { href: "/", label: "Resumen", code: "01" },
  { href: "/ideas", label: "Ideas", code: "02" },
  { href: "/videos", label: "Vídeos", code: "03" },
  { href: "/metrics", label: "Métricas", code: "04" },
  { href: "/roadmap", label: "Roadmap", code: "05" },
];

export function Sidebar() {
  return (
    <aside className="border-b border-line bg-panel/80 px-5 py-5 backdrop-blur lg:fixed lg:inset-y-0 lg:w-64 lg:border-b-0 lg:border-r lg:px-7 lg:py-8">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full border border-acid/50 bg-acid/10 text-xs font-black text-acid">
          AI
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Canal</p>
          <p className="font-semibold tracking-wide text-white">YouTube Studio</p>
        </div>
      </Link>

      <nav className="mt-6 flex gap-2 overflow-x-auto lg:mt-14 lg:block lg:space-y-2">
        {navigation.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className="group flex min-w-max items-center gap-4 rounded-lg border border-transparent px-3 py-2.5 text-sm text-slate-400 transition hover:border-line hover:bg-white/[0.03] hover:text-white"
          >
            <span className="font-mono text-[10px] text-slate-600 group-hover:text-acid">
              {item.code}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-8 hidden lg:block">
        <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-600">
          Estado del sistema
        </p>
        <p className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-acid shadow-[0_0_12px_#b8ff5c]" />
          Modo local · MVP
        </p>
      </div>
    </aside>
  );
}
