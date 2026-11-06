import { seedProjects } from "@/data/seedPortfolioData";

// Slugs that get a pre-rendered page at /projects/<slug>/ during `next build`
// (see generateStaticParams in src/app/projects/[slug]/page.jsx).
export const staticProjectSlugs = seedProjects.map((project) => project.slug).filter(Boolean);

const staticProjectSlugSet = new Set(staticProjectSlugs);

// GitHub Pages can only serve files that exist in the static export. Projects
// added after the build (Firestore via the admin dashboard, or repos auto-synced
// from GitHub) have no /projects/<slug>/ page, so they are routed to the
// client-rendered /projects/view/?slug=<slug> page instead of a 404.
export function projectHref(slug) {
  if (!slug) return "/projects/";
  if (staticProjectSlugSet.has(slug)) return `/projects/${slug}/`;
  return `/projects/view/?slug=${encodeURIComponent(slug)}`;
}
