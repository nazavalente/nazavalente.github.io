"use client";

import { useCollection } from "@/hooks/useCollection";
import { Loading } from "@/components/ui/Loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { seedProjects } from "@/data/seedPortfolioData";
import { uniqueByPortfolioIdentity } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";
import { SectionHeader } from "./SectionHeader";

export function FeaturedProjects() {
  const { items, loading, error } = useCollection("projects");
  const fallbackProjects = uniqueByPortfolioIdentity(seedProjects)
    .filter((project) => project.isFeatured)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .slice(0, 3);
  const firestoreFeatured = uniqueByPortfolioIdentity([...items, ...seedProjects])
    .filter((project) => project.isFeatured)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .slice(0, 6);
  const visibleProjects = firestoreFeatured.length > 0 ? firestoreFeatured : fallbackProjects;

  return (
    <section className="section">
      <div className="container">
        <SectionHeader eyebrow="Featured Projects" title="Selected work from GitHub and workspace." description="Highlighted projects based on public repositories, local project files, and verified project metadata." />
        {loading && <Loading />}
        {error && visibleProjects.length === 0 && <EmptyState title="Could not load projects" description={error} />}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => <ProjectCard key={project.id || project.slug} project={project} />)}
        </div>
      </div>
    </section>
  );
}
