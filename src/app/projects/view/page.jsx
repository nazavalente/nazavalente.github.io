import { Suspense } from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Loading } from "@/components/ui/Loading";
import { ProjectViewClient } from "./ProjectViewClient";

// Detail page for projects that have no pre-rendered /projects/<slug>/ page
// (see projectHref in src/lib/routes.js). The slug is read from ?slug= in the
// browser, so a single static file serves every such project on GitHub Pages.
function ProjectViewFallback() {
  return (
    <>
      <Navbar />
      <main className="section pt-10 md:pt-14">
        <div className="container">
          <Loading label="Loading project" />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ProjectViewPage() {
  return (
    <Suspense fallback={<ProjectViewFallback />}>
      <ProjectViewClient />
    </Suspense>
  );
}
