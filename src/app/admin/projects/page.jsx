import { AdminLayout } from "@/components/admin/AdminLayout";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { projectFields } from "@/components/admin/forms";
import { seedProjects } from "@/data/seedPortfolioData";

export default function AdminProjectsPage() {
  return <AdminLayout title="Projects"><CollectionManager title="Projects" collectionName="projects" fields={projectFields} seedRows={seedProjects} /></AdminLayout>;
}
