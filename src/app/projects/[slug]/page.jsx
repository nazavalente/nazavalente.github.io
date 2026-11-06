import { staticProjectSlugs } from "@/lib/routes";
import { ProjectDetailClient } from "./ProjectDetailClient";

export function generateStaticParams() {
  return staticProjectSlugs.map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;

  return <ProjectDetailClient slug={slug} />;
}
