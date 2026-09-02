"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Github } from "lucide-react";
import { useCollection } from "@/hooks/useCollection";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { seedRepositories } from "@/data/seedPortfolioData";
import { fetchPublicGitHubRepositories } from "@/lib/github";
import { isPlaceholderValue, uniqueByPortfolioIdentity } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

export function GitHubRepositories() {
  const { items, loading, error } = useCollection("githubRepositories");
  const [githubRepositories, setGitHubRepositories] = useState([]);
  const [githubError, setGitHubError] = useState("");

  useEffect(() => {
    let active = true;
    fetchPublicGitHubRepositories()
      .then((repos) => {
        if (active) setGitHubRepositories(repos);
      })
      .catch((err) => {
        if (active) setGitHubError(err.message || "Could not sync GitHub repositories.");
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleRepositories = useMemo(() => {
    const base = uniqueByPortfolioIdentity(items.length > 0 ? items : seedRepositories);
    const known = new Set(base.map((repo) => (repo.githubUrl || repo.name || "").toLowerCase()));
    const autoSynced = githubRepositories.filter((repo) => !known.has((repo.githubUrl || repo.name || "").toLowerCase()));
    return uniqueByPortfolioIdentity([...base, ...autoSynced]).sort((a, b) => Number(a.order || 999) - Number(b.order || 999));
  }, [items, githubRepositories]);

  return (
    <section className="section">
      <div className="container">
        <SectionHeader eyebrow="GitHub" title="Repository index." description="Public repositories and project code references from Nazario's GitHub profile." />
        {loading && <Loading />}
        {error && visibleRepositories.length === 0 && <EmptyState title="Could not load repositories" description={error} />}
        {githubError && visibleRepositories.length === 0 && <EmptyState title="Could not sync GitHub" description={githubError} />}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleRepositories.map((repo) => (
            <Card key={repo.id || repo.name}>
              <Github className="h-8 w-8 text-teal-200" />
              <h3 className="mt-5 text-xl font-semibold text-white">{repo.name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{repo.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {!isPlaceholderValue(repo.language) && <Badge>{repo.language}</Badge>}
                <Badge>{repo.category}</Badge>
              </div>
              {repo.githubUrl && !isPlaceholderValue(repo.githubUrl) && <Link href={repo.githubUrl} className="mt-5 inline-flex text-sm font-semibold text-teal-200">Open repository</Link>}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
