"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Plus, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { createDocument, deleteDocument, deleteDuplicateDocuments, seedCollection, syncCollectionFromSeed, updateDocument } from "@/lib/firestore";
import { normalizeArray, slugify } from "@/lib/utils";
import { useCollection } from "@/hooks/useCollection";
import { UploadField } from "./UploadField";
import { DataTable } from "./DataTable";

export function CollectionManager({ title, collectionName, fields, seedRows = [] }) {
  const { items, loading, error, reload } = useCollection(collectionName, collectionName === "contactMessages" ? { orderBy: "createdAt", direction: "desc" } : {});
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });

  const columns = useMemo(() => fields.filter((field) => field.table !== false).slice(0, 4).map((field) => ({ key: field.name, label: field.label })), [fields]);

  function openForm(row = null) {
    setEditing(row);
    setForm(row || {});
    setErrors({});
    setOpen(true);
  }

  function setValue(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function validate() {
    const nextErrors = {};
    fields.forEach((field) => {
      const value = form[field.name];
      if (field.required && !String(value || "").trim()) nextErrors[field.name] = `${field.label} is required before saving.`;
      if (field.name.toLowerCase().includes("url") && value && !/^https?:\/\/.+/.test(String(value))) {
        nextErrors[field.name] = `${field.label} must start with http:// or https://. Leave it empty if the link is not ready.`;
      }
      if (field.name === "order" && value && Number.isNaN(Number(value))) nextErrors[field.name] = "Order must be a number.";
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) setStatus({ type: "error", message: "Please review the highlighted fields." });
    return Object.keys(nextErrors).length === 0;
  }

  async function save(event) {
    event.preventDefault();
    if (!validate()) return;
    const payload = {};
    fields.forEach((field) => {
      let value = form[field.name] ?? "";
      if (field.type === "array") value = normalizeArray(value);
      if (field.type === "boolean") value = Boolean(value);
      payload[field.name] = value;
    });
    if (payload.title && fields.some((field) => field.name === "slug") && !payload.slug) payload.slug = slugify(payload.title);
    try {
      setStatus({ type: "info", message: "Saving changes..." });
      if (editing?.id) await updateDocument(collectionName, editing.id, payload);
      else await createDocument(collectionName, payload);
      setStatus({ type: "success", message: "Saved successfully." });
      setOpen(false);
      await reload();
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Could not save item." });
    }
  }

  async function remove(row) {
    if (!confirm(`Delete "${row.title || row.name || row.role || row.subject}"?`)) return;
    try {
      await deleteDocument(collectionName, row.id);
      setStatus({ type: "success", message: "Item deleted." });
      await reload();
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Could not delete item." });
    }
  }

  async function importSeed() {
    if (!seedRows.length) return;
    if (!confirm(`Import ${seedRows.length} seed rows into ${collectionName}?`)) return;
    try {
      setStatus({ type: "info", message: "Importing seed data..." });
      const result = await seedCollection(collectionName, seedRows);
      setStatus({
        type: "success",
        message: result.created ? `Imported ${result.created} new row${result.created === 1 ? "" : "s"}. Skipped ${result.skipped} existing row${result.skipped === 1 ? "" : "s"}.` : "All seed rows already exist. Nothing new was imported."
      });
      await reload();
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Could not import seed data." });
    }
  }

  async function syncFromSeed() {
    if (!seedRows.length) return;
    if (!confirm(`Sync ${seedRows.length} seed rows into ${collectionName}? This adds missing rows and updates any field that changed in the seed file, without touching fields the seed leaves blank.`)) return;
    try {
      setStatus({ type: "info", message: "Syncing from seed data..." });
      const result = await syncCollectionFromSeed(collectionName, seedRows);
      setStatus({
        type: "success",
        message: result.created || result.updated ? `Created ${result.created} row${result.created === 1 ? "" : "s"}, updated ${result.updated} row${result.updated === 1 ? "" : "s"}.` : "Already up to date with the seed file."
      });
      await reload();
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Could not sync seed data." });
    }
  }

  async function removeDuplicates() {
    if (collectionName === "contactMessages") return;
    if (!confirm(`Remove duplicate rows from ${collectionName}? This keeps the first copy and deletes repeated entries.`)) return;
    try {
      setStatus({ type: "info", message: "Removing duplicate rows..." });
      const deleted = await deleteDuplicateDocuments(collectionName);
      setStatus({ type: "success", message: deleted ? `Removed ${deleted} duplicate row${deleted === 1 ? "" : "s"}.` : "No duplicates found." });
      await reload();
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Could not remove duplicates." });
    }
  }

  const statusStyles = {
    info: "border-sky-300/20 bg-sky-400/10 text-sky-100",
    success: "border-teal-300/20 bg-teal-400/10 text-teal-100",
    error: "border-rose-300/20 bg-rose-400/10 text-rose-100"
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">Create, edit, delete, and keep this portfolio collection fresh.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {collectionName !== "contactMessages" && <Button variant="secondary" onClick={removeDuplicates}><Trash2 className="h-4 w-4" /> Remove Duplicates</Button>}
          {seedRows.length > 0 && <Button variant="secondary" onClick={importSeed}><UploadCloud className="h-4 w-4" /> Import Seed</Button>}
          {seedRows.length > 0 && <Button variant="secondary" onClick={syncFromSeed}><RefreshCw className="h-4 w-4" /> Sync from Seed</Button>}
          <Button onClick={() => openForm()}><Plus className="h-4 w-4" /> New Item</Button>
        </div>
      </div>
      {status.message && (
        <p className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${statusStyles[status.type] || statusStyles.info}`}>
          {status.type === "error" ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{status.message}</span>
        </p>
      )}
      {loading && <div className="h-60 animate-pulse rounded-2xl bg-white/7" />}
      {error && <EmptyState title="Could not load collection" description={error} />}
      {!loading && !error && items.length === 0 && <EmptyState title={`No ${title.toLowerCase()} yet`} />}
      {!loading && !error && items.length > 0 && <DataTable rows={items} columns={columns} onEdit={openForm} onDelete={remove} />}
      <Modal open={open} title={editing ? `Edit ${title}` : `Create ${title}`} onClose={() => setOpen(false)}>
        <form onSubmit={save} className="grid max-h-[72vh] gap-4 overflow-y-auto pr-1">
          {fields.map((field) => {
            if (field.type === "textarea") return <Textarea key={field.name} label={field.label} value={form[field.name] || ""} onChange={(e) => setValue(field.name, e.target.value)} error={errors[field.name]} />;
            if (field.type === "array") return <Textarea key={field.name} label={`${field.label} (comma separated)`} value={Array.isArray(form[field.name]) ? form[field.name].join(", ") : form[field.name] || ""} onChange={(e) => setValue(field.name, e.target.value)} error={errors[field.name]} />;
            if (field.type === "boolean") return <label key={field.name} className="flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" checked={Boolean(form[field.name])} onChange={(e) => setValue(field.name, e.target.checked)} /> {field.label}</label>;
            if (field.type === "upload") return <div key={field.name} className="grid gap-2"><Input label={field.label} value={form[field.name] || ""} onChange={(e) => setValue(field.name, e.target.value)} error={errors[field.name]} /><UploadField label={`Upload ${field.label}`} folder={collectionName} onUploaded={(url) => setValue(field.name, url)} /></div>;
            return <Input key={field.name} label={field.label} value={form[field.name] || ""} onChange={(e) => setValue(field.name, e.target.value)} error={errors[field.name]} />;
          })}
          <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </Card>
        </form>
      </Modal>
    </div>
  );
}
