"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { uploadPortfolioFile } from "@/lib/storage";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function UploadField({ label = "Upload file", folder = "portfolio", onUploaded }) {
  const [status, setStatus] = useState("");

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    // Same limits as firebase/storage.rules, checked here for a clearer message.
    if (!/^image\/|^application\/pdf$/.test(file.type)) {
      setStatus("Only images or PDF files can be uploaded.");
      return;
    }
    if (file.size >= MAX_UPLOAD_BYTES) {
      setStatus("File is too large. The limit is 10 MB.");
      return;
    }
    try {
      setStatus("Uploading...");
      const url = await uploadPortfolioFile(file, folder);
      onUploaded(url);
      setStatus("Upload complete.");
    } catch (error) {
      setStatus(error.message || "Upload failed.");
    }
  }

  return (
    <label className="block rounded-xl border border-dashed border-white/15 bg-white/5 p-4">
      <span className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300"><Upload className="h-4 w-4" /> {label}</span>
      <input type="file" accept="image/*,application/pdf" onChange={upload} className="text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-300 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-950" />
      {status && <p className="mt-2 text-xs text-slate-400">{status}</p>}
    </label>
  );
}
