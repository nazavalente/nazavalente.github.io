import Link from "next/link";
import { cn } from "@/lib/utils";

export function Button({ href, children, variant = "primary", className = "", ...props }) {
  const base = "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";
  const styles = {
    primary: "bg-teal-300 text-slate-950 shadow-glow hover:-translate-y-0.5 hover:bg-teal-200",
    secondary: "border border-white/15 bg-white/8 text-white hover:-translate-y-0.5 hover:bg-white/12",
    ghost: "text-slate-300 hover:bg-white/8 hover:text-white",
    danger: "border border-rose-400/30 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
  };
  const classes = cn(base, styles[variant], className);
  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}
