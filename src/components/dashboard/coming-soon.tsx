export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex h-72 flex-col items-center justify-center rounded-card border border-dashed border-border text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">This section isn&apos;t built yet.</p>
    </div>
  );
}
