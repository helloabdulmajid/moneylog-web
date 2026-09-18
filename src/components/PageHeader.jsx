export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        {subtitle && (
          <p className="mb-1 flex items-center gap-1.5 font-ledger text-[11px] uppercase tracking-[0.16em] text-accent-sienna">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-sienna inline-block" />
            {subtitle}
          </p>
        )}
        <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
        <span className="mt-2 block h-0.5 w-10 rounded-full bg-accent-sienna" />
      </div>
      {action}
    </div>
  );
}