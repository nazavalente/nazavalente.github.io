"use client";

import { useSearchParams } from "next/navigation";
import { ProjectDetailClient } from "@/app/projects/[slug]/ProjectDetailClient";

export function ProjectViewClient() {
  const slug = useSearchParams().get("slug") || "";

  // `key` remounts the detail view when moving between projects on this same
  // route (only the query string changes), so no stale state carries over.
  return <ProjectDetailClient key={slug} slug={slug} />;
}
