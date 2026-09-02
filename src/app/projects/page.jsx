"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ProjectCard } from "@/components/public/ProjectCard";
import { SectionHeader } from "@/components/public/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { seedProjects } from "@/data/seedPortfolioData";
import { useCollection } from "@/hooks/useCollection";
import { fetchPublicGitHubProjects } from "@/lib/github";
import { uniqueByPortfolioIdentity } from "@/lib/utils";

export default function ProjectsPage() {
  const { items, loading, error } = useCollection("projects");
  const [githubProjects, setGitHubProjects] = useState([]);
  const [githubError, setGitHubError] = useState("");
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  useEffect(() => {
    let activeRequest = true;
    fetchPublicGitHubProjects()
      .then((projects) => {
        if (activeRequest) setGitHubProjects(projects);
      })
      .catch((err) => {
        if (activeRequest) setGitHubError(err.message || "Could not sync GitHub projects.");
      });
    return () => {
      activeRequest = false;
    };
  }, []);

  const visibleProjects = useMemo(() => {
    const base = uniqueByPortfolioIdentity(items.length > 0 ? [...items, ...seedProjects] : seedProjects);
    const known = new Set(base.flatMap((project) => [project.slug, project.githubUrl]).filter(Boolean).map((value) => String(value).toLowerCase()));
    const autoSynced = githubProjects.filter((project) => {
      return !known.has(project.slug.toLowerCase()) && !known.has(String(project.githubUrl || "").toLowerCase());
    });
    return uniqueByPortfolioIdentity([...base, ...autoSynced]).sort((a, b) => Number(a.order || 999) - Number(b.order || 999));
  }, [items, githubProjects]);
  const filters = useMemo(() => {
    const categories = [...new Set(visibleProjects.map((project) => project.category).filter(Boolean))];
    return ["All", ...categories];
  }, [visibleProjects]);
  const filtered = useMemo(() => visibleProjects.filter((project) => {
    const matchesFilter = active === "All" || project.category === active;
    const text = `${project.title} ${project.description} ${(project.techStack || []).join(" ")}`.toLowerCase();
    return matchesFilter && text.includes(search.toLowerCase());
  }), [visibleProjects, active, search]);

  return (
    <>
      <Navbar />
      <main className="section">
        <div className="container">
          <SectionHeader eyebrow="Projects" title="All portfolio projects." description="Search and filter selected work from GitHub repositories and local project metadata." />
          <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto]">
            <label className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." className="focus-ring w-full rounded-xl border border-white/10 bg-white/7 py-3 pl-11 pr-4 text-sm text-white" />
            </label>
            <div className="flex max-w-full gap-2 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <button key={filter} onClick={() => setActive(filter)} className={`focus-ring shrink-0 rounded-full px-4 py-2 text-sm transition ${active === filter ? "bg-teal-300 text-slate-950" : "bg-white/8 text-slate-300 hover:bg-white/12"}`}>{filter}</button>
              ))}
            </div>
          </div>
          {loading && <Loading />}
          {error && filtered.length === 0 && <EmptyState title="Could not load projects" description={error} />}
          {githubError && filtered.length === 0 && <EmptyState title="Could not sync GitHub projects" description={githubError} />}
          {!loading && !error && filtered.length === 0 && <EmptyState title="No projects match this view" description="Try another keyword or category filter." />}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => <ProjectCard key={project.id || project.slug} project={project} />)}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
