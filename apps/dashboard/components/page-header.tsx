type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-acid">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {action}
    </header>
  );
}
