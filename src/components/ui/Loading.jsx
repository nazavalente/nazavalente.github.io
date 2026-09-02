export function Loading({ label = "Loading content" }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="overflow-hidden rounded-2xl border border-white/10 bg-white/6 p-4" aria-label={label}>
          <div className="h-28 animate-pulse rounded-xl bg-white/10" />
          <div className="mt-4 h-4 w-2/3 animate-pulse rounded-full bg-white/10" />
          <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-white/8" />
          <div className="mt-2 h-3 w-4/5 animate-pulse rounded-full bg-white/8" />
        </div>
      ))}
    </div>
  );
}
