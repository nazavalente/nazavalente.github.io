import { Button } from "@/components/ui/Button";

export function DataTable({ rows, columns, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/30">
      <div className="border-b border-white/10 px-4 py-3 text-xs text-slate-400 md:hidden">
        Swipe horizontally to see all columns.
      </div>
      <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse bg-slate-950/45 text-left text-sm">
        <thead className="bg-white/7 text-slate-300">
          <tr>
            {columns.map((column) => <th key={column.key} className="px-4 py-3 font-medium">{column.label}</th>)}
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-white/10 transition hover:bg-white/[0.035]">
              {columns.map((column) => <td key={column.key} className="max-w-xs truncate px-4 py-3 text-slate-300" title={Array.isArray(row[column.key]) ? row[column.key].join(", ") : row[column.key]}>{Array.isArray(row[column.key]) ? row[column.key].join(", ") : row[column.key]}</td>)}
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => onEdit(row)}>Edit</Button>
                  <Button variant="danger" onClick={() => onDelete(row)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
