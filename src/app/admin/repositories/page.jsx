import { AdminLayout } from "@/components/admin/AdminLayout";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { repositoryFields } from "@/components/admin/forms";
import { seedRepositories } from "@/data/seedPortfolioData";

export default function AdminRepositoriesPage() {
  return <AdminLayout title="Repositories"><CollectionManager title="Repositories" collectionName="githubRepositories" fields={repositoryFields} seedRows={seedRepositories} /></AdminLayout>;
}
