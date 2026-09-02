import { Inbox } from "lucide-react";

export function EmptyState({ title = "No content yet", description = "Add content from the admin dashboard." }) {
  return (
    <div className="premium-border rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
      <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-teal-300/12">
        <Inbox className="h-6 w-6 text-teal-200" />
      </span>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">{description}</p>
    </div>
  );
}
