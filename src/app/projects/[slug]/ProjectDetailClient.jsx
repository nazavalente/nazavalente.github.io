"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, ExternalLink, Github, Sparkles } from "lucide-react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { seedProjects } from "@/data/seedPortfolioData";
import { getCollection, getProjectBySlug } from "@/lib/firestore";
import { fetchPublicGitHubProjectBySlug } from "@/lib/github";
import { cleanPlaceholderArray, cleanPlaceholderText, isPlaceholderValue } from "@/lib/utils";

export function ProjectDetailClient({ slug }) {
  const fallbackProject = seedProjects.find((item) => item.slug === slug);
  const fallbackRelated = seedProjects
    .filter((item) => item.slug !== slug)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .slice(0, 3);
  const [project, setProject] = useState(fallbackProject || null);
  const [related, setRelated] = useState(fallbackRelated);
  const [loading, setLoading] = useState(!fallbackProject);
  const [error, setError] = useState("");
  const hasGithub = project?.githubUrl && !isPlaceholderValue(project.githubUrl);
  const hasLiveUrl = project?.liveUrl && !isPlaceholderValue(project.liveUrl);

  useEffect(() => {
    const seedProject = seedProjects.find((item) => item.slug === slug);
    const seedRelated = seedProjects
      .filter((item) => item.slug !== slug)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
      .slice(0, 3);

    async function load() {
      try {
        if (seedProject) {
          setProject(seedProject);
          setRelated(seedRelated);
          setLoading(false);
        } else {
          setLoading(true);
        }
        const item = await getProjectBySlug(slug).catch(() => null);
        const githubItem = item ? null : await fetchPublicGitHubProjectBySlug(slug).catch(() => null);
        const nextProject = item || githubItem;
        if (nextProject) {
          setProject(nextProject);
          const projects = await getCollection("projects", { limit: 3 }).catch(() => seedRelated);
          setRelated(projects.filter((entry) => entry.slug !== nextProject.slug).slice(0, 3));
        }
      } catch (err) {
        if (!seedProject) setError(err.message || "Unable to load project.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  return (
    <>
      <Navbar />
      <main className="section pt-10 md:pt-14">
        <div className="container">
          <Link href="/projects" className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/7 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to projects</Link>
          {loading && (
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="h-[28rem] animate-pulse rounded-3xl border border-white/10 bg-white/7" />
              <div className="grid content-start gap-4">
                {[1, 2, 3, 4].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/7" />)}
              </div>
            </div>
          )}
          {error && <EmptyState title="Could not load project" description={error} />}
          {!loading && !error && !project && <EmptyState title="Project not found" />}
          {project && (
            <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
              <div>
                <div className="premium-border soft-grid overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-teal-300/18 via-slate-900 to-indigo-400/16 p-4 md:p-8">
                  {project.imageUrl ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl">
                      <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="grid aspect-video place-items-center rounded-2xl border border-white/10 bg-slate-950/45 p-6 text-center">
                      <div>
                        <Sparkles className="mx-auto mb-4 h-8 w-8 text-teal-200" />
                        <p className="text-sm uppercase tracking-[0.2em] text-teal-100">{project.category}</p>
                        <h1 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-5xl">{project.title}</h1>
                      </div>
                    </div>
                  )}
                </div>
                <Card className="mt-6">
                  <h2 className="text-2xl font-semibold text-white">Project Overview</h2>
                  <p className="mt-4 leading-7 text-slate-300">{project.longDescription || project.description}</p>
                </Card>
                <Card className="mt-5">
                  <h2 className="text-2xl font-semibold text-white">Development Process</h2>
                  <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">{cleanPlaceholderText(project.developmentProcess, "Development notes will be added after the project workflow is documented in more detail.")}</p>
                </Card>
              </div>
              <div className="grid content-start gap-5">
                <Card className="premium-border">
                  <div className="flex flex-wrap gap-2">
                    {!isPlaceholderValue(project.category) && <Badge>{project.category}</Badge>}
                    {!isPlaceholderValue(project.status) && <Badge>{project.status}</Badge>}
                    {!isPlaceholderValue(project.createdYear) && <Badge>{project.createdYear}</Badge>}
                  </div>
                  <h1 className="mt-5 text-3xl font-semibold leading-tight text-white md:text-4xl">{project.title}</h1>
                  <p className="mt-4 leading-7 text-slate-400">{project.description}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {hasLiveUrl && <Button href={project.liveUrl}><ExternalLink className="h-4 w-4" /> {hasGithub ? "Live Demo" : "Open Live App"}</Button>}
                    {hasGithub && <Button href={project.githubUrl} variant="secondary"><Github className="h-4 w-4" /> GitHub</Button>}
                  </div>
                </Card>
                <Card>
                  <h2 className="font-semibold text-white">Purpose</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{cleanPlaceholderText(project.problem, "Purpose details will be added after the project repository is verified.")}</p>
                </Card>
                <Card>
                  <h2 className="font-semibold text-white">Features</h2>
                  <ul className="mt-3 grid gap-3 text-sm text-slate-400">
                    {cleanPlaceholderArray(project.features || []).map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-200" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {cleanPlaceholderArray(project.features || []).length === 0 && <li>Feature details will be added soon.</li>}
                  </ul>
                </Card>
                <Card>
                  <h2 className="font-semibold text-white">Tech Stack</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cleanPlaceholderArray(project.techStack || []).map((tech) => <Badge key={tech}>{tech}</Badge>)}
                    {cleanPlaceholderArray(project.techStack || []).length === 0 && <p className="text-sm text-slate-400">Tech stack will be added soon.</p>}
                  </div>
                </Card>
                <Card>
                  <h2 className="font-semibold text-white">Role & Result</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{cleanPlaceholderText(project.role, "Role details will be updated after contribution notes are verified.")}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {hasLiveUrl && !hasGithub
                      ? "The project is presented as a deployed live web app, with Firebase Hosting used as the deployment platform."
                      : "Result or impact details will be added after they are documented."}
                  </p>
                </Card>
              </div>
            </div>
          )}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 text-2xl font-semibold text-white">Related projects</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {related.map((item) => (
                  <Card key={item.id || item.slug} className="hover:-translate-y-1">
                    <Badge>{item.category}</Badge>
                    <h3 className="mt-3 font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">{item.description}</p>
                    <Link href={`/projects/${item.slug}/`} className="mt-4 inline-flex text-sm font-semibold text-teal-200">View details</Link>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
