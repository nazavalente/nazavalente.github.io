"use client";

import { useEffect, useState } from "react";
import { FolderKanban, Github, Medal, MessageSquare, Sparkles, Trash2, UploadCloud } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { deleteDuplicateDocuments, getCollection, seedCollection } from "@/lib/firestore";
import { fetchPublicGitHubProjects, fetchPublicGitHubRepositories } from "@/lib/github";
import { uniqueByPortfolioIdentity } from "@/lib/utils";
import { portfolioSeed, seedProjects } from "@/data/seedPortfolioData";

const stats = [
  ["projects", "Projects", FolderKanban],
  ["githubRepositories", "Repositories", Github],
  ["achievements", "Achievements", Medal],
  ["skills", "Skills", Sparkles],
  ["contactMessages", "Messages", MessageSquare]
];

// One shared GitHub sync at a time, across renders and remounts. React
// StrictMode runs mount effects twice in dev, and leaving/re-entering the
// dashboard remounts it; two overlapping runs would both read Firestore before
// either writes and insert the same new repos twice.
let githubSyncInFlight = null;

function runGithubSync() {
  if (!githubSyncInFlight) {
    githubSyncInFlight = (async () => {
      const [projects, repositories] = await Promise.all([
        fetchPublicGitHubProjects(),
        fetchPublicGitHubRepositories()
      ]);
      // Public project pages always merge seedProjects over Firestore rows, so a
      // generic GitHub copy of a curated seed project would replace its text.
      const projectResult = await seedCollection("projects", projects, { knownRows: seedProjects });
      const repoResult = await seedCollection("githubRepositories", repositories);
      return {
        created: projectResult.created + repoResult.created,
        skipped: projectResult.skipped + repoResult.skipped
      };
    })().finally(() => {
      githubSyncInFlight = null;
    });
  }
  return githubSyncInFlight;
}

export default function DashboardPage() {
  const [counts, setCounts] = useState({});
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const next = {};
    await Promise.all(stats.map(async ([collection]) => {
      try {
        const rows = await getCollection(collection, collection === "contactMessages" ? { orderBy: "createdAt", direction: "desc" } : {});
        next[collection] = collection === "contactMessages" ? rows.length : uniqueByPortfolioIdentity(rows).length;
      } catch {
        next[collection] = 0;
      }
    }));
    setCounts(next);
  }

  async function syncGithubToFirestore({ silent = false } = {}) {
    try {
      if (!silent) {
        setBusy(true);
        setStatus("Syncing public GitHub repositories...");
      }
      const { created, skipped } = await runGithubSync();
      if (!silent || created > 0) {
        setStatus(created ? `Synced ${created} new GitHub rows. Skipped ${skipped} existing rows.` : "GitHub repositories are already synced.");
      }
      await load();
    } catch (err) {
      if (!silent) setStatus(err.message || "Could not sync GitHub repositories.");
    } finally {
      if (!silent) setBusy(false);
    }
  }

  useEffect(() => {
    load();
    syncGithubToFirestore({ silent: true });
    // Runs once on mount; both helpers only read module state and setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function importAll() {
    if (!confirm("Import all detected seed data into Firestore?")) return;
    try {
      setBusy(true);
      setStatus("Importing seed data...");
      // Let a background GitHub sync finish first so both never insert the same rows.
      if (githubSyncInFlight) await githubSyncInFlight.catch(() => {});
      let created = 0;
      let skipped = 0;
      for (const [collection, rows] of Object.entries(portfolioSeed)) {
        const result = await seedCollection(collection, rows);
        created += result.created;
        skipped += result.skipped;
      }
      setStatus(created ? `Imported ${created} new rows. Skipped ${skipped} existing rows.` : "All seed data already exists. Nothing new was imported.");
      await load();
    } catch (err) {
      setStatus(err.message || "Could not import seed data.");
    } finally {
      setBusy(false);
    }
  }

  async function removeAllDuplicates() {
    if (!confirm("Remove duplicate rows from all portfolio collections? This keeps the first copy of each item.")) return;
    try {
      setBusy(true);
      setStatus("Removing duplicate rows...");
      let deleted = 0;
      for (const collection of Object.keys(portfolioSeed)) {
        deleted += await deleteDuplicateDocuments(collection);
      }
      setStatus(deleted ? `Removed ${deleted} duplicate rows.` : "No duplicates found.");
      await load();
    } catch (err) {
      setStatus(err.message || "Could not remove duplicates.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-6">
        <Card className="premium-border flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white">Portfolio content center</h2>
            <p className="mt-2 text-sm text-slate-400">Manage public content, media uploads, and contact messages from Firestore.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={removeAllDuplicates} disabled={busy}><Trash2 className="h-4 w-4" /> Remove All Duplicates</Button>
            <Button variant="secondary" onClick={() => syncGithubToFirestore()} disabled={busy}><Github className="h-4 w-4" /> Sync GitHub</Button>
            <Button onClick={importAll} disabled={busy}><UploadCloud className="h-4 w-4" /> Import Detected Seed Data</Button>
          </div>
        </Card>
        {status && <p className="rounded-xl border border-teal-300/20 bg-teal-400/10 px-4 py-3 text-sm text-teal-100">{status}</p>}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {stats.map(([key, label, Icon]) => (
            <Card key={key} className="hover:-translate-y-1">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/8">
                <Icon className="h-6 w-6 text-teal-200" />
              </span>
              <p className="mt-5 text-3xl font-semibold text-white">{counts[key] ?? 0}</p>
              <p className="mt-1 text-sm text-slate-400">{label}</p>
            </Card>
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <h3 className="text-lg font-semibold text-white">Recommended workflow</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">Import seed data, complete any missing details, upload images or certificates, then deploy Firebase rules before going public.</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-white">Production note</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">Writes are restricted to accounts with the admin custom claim, enforced by Firestore and Storage security rules regardless of who is signed in here.</p>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
