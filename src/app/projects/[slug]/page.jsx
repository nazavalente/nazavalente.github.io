import { seedProjects } from "@/data/seedPortfolioData";
import { ProjectDetailClient } from "./ProjectDetailClient";

export function generateStaticParams() {
  return seedProjects.map((project) => ({
    slug: project.slug
  }));
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;

  return <ProjectDetailClient slug={slug} />;
}
