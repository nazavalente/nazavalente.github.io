import { AdminLayout } from "@/components/admin/AdminLayout";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { experienceFields } from "@/components/admin/forms";
import { seedExperiences } from "@/data/seedPortfolioData";

export default function AdminExperiencesPage() {
  return <AdminLayout title="Experiences"><CollectionManager title="Experiences" collectionName="experiences" fields={experienceFields} seedRows={seedExperiences} /></AdminLayout>;
}
