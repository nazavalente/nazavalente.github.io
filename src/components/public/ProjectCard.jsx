"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cleanPlaceholderArray, isPlaceholderValue } from "@/lib/utils";

export function ProjectCard({ project }) {
  const tech = cleanPlaceholderArray(project.techStack || []);
  const features = cleanPlaceholderArray(project.features || []);
  const hasGithub = project.githubUrl && !isPlaceholderValue(project.githubUrl);
  const hasLiveUrl = project.liveUrl && !isPlaceholderValue(project.liveUrl);
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.42, ease: "easeOut" }}>
      <Card className="premium-border group flex h-full flex-col overflow-hidden p-0 hover:-translate-y-1 hover:border-teal-200/20">
        <div className="relative grid aspect-[16/9] place-items-center overflow-hidden border-b border-white/10 bg-gradient-to-br from-teal-300/18 via-slate-900 to-indigo-400/16 p-5">
          <div className="absolute inset-0 soft-grid opacity-45" />
          {project.imageUrl ? (
            <Image src={project.imageUrl} alt={project.title} fill className="relative rounded-xl object-cover transition duration-500 group-hover:scale-[1.03]" />
          ) : (
            <div className="relative text-center">
              <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-teal-300 text-slate-950">
                <Layers3 className="h-5 w-5" />
              </span>
              <p className="text-xs uppercase tracking-[0.2em] text-teal-100">{project.category}</p>
              <h3 className="mt-3 text-xl font-semibold leading-tight text-white sm:text-2xl">{project.title}</h3>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{project.category || "Project"}</Badge>
            {!isPlaceholderValue(project.status) && <Badge>{project.status}</Badge>}
          </div>
          <h3 className="mt-4 text-xl font-semibold text-white">{project.title}</h3>
          <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{project.description}</p>
          {features.length > 0 && (
            <ul className="mt-4 grid gap-2 text-sm text-slate-300">
              {features.slice(0, 3).map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300" />
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {tech.slice(0, 4).map((item) => <Badge key={item}>{item}</Badge>)}
            {tech.length > 4 && <Badge>+{tech.length - 4}</Badge>}
          </div>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              {hasLiveUrl && !hasGithub && (
                <Link href={project.liveUrl} className="inline-flex items-center gap-2 rounded-xl bg-teal-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-200">
                  Open Live App <ExternalLink className="h-4 w-4" />
                </Link>
              )}
              <Link href={`/projects/${project.slug}/`} className="inline-flex items-center gap-2 text-sm font-semibold text-teal-200 hover:text-teal-100">
                Details <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            {hasGithub && (
              <Link href={project.githubUrl} className="text-slate-300 hover:text-white" aria-label={`${project.title} GitHub`}>
                <Github className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
