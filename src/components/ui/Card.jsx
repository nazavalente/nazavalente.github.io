import { cn } from "@/lib/utils";

export function Card({ children, className = "" }) {
  return <div className={cn("glass rounded-2xl p-5 transition duration-300", className)}>{children}</div>;
}
