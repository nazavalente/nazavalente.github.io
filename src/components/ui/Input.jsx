export function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>}
      <input
        aria-invalid={Boolean(error)}
        className={`focus-ring w-full rounded-xl border ${error ? "border-rose-300/50 bg-rose-950/20" : "border-white/10 bg-slate-950/60"} px-4 py-3 text-sm text-white placeholder:text-slate-500 transition hover:border-white/20 ${className}`}
        {...props}
      />
      {error && <span className="mt-2 block rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-200">{error}</span>}
    </label>
  );
}
