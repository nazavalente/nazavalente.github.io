import { cn } from "@/lib/utils";

export function Badge({ children, className = "" }) {
  return (
    <span className={cn("inline-flex max-w-full items-center rounded-full border border-white/10 bg-white/7 px-3 py-1 text-xs font-medium leading-5 text-slate-300", className)}>
      {children}
    </span>
  );
}
