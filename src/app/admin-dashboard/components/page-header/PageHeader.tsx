export function PageHeader({
  title,
  cta,
}: {
  title: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="flex items-center gap-2">{cta}</div>
    </div>
  );
}
