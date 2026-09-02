import { AdminLayout } from "@/components/admin/AdminLayout";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { skillFields } from "@/components/admin/forms";
import { seedSkills } from "@/data/seedPortfolioData";

export default function AdminSkillsPage() {
  return <AdminLayout title="Skills"><CollectionManager title="Skills" collectionName="skills" fields={skillFields} seedRows={seedSkills} /></AdminLayout>;
}
