export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}