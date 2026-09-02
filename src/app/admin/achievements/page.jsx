import { AdminLayout } from "@/components/admin/AdminLayout";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { achievementFields } from "@/components/admin/forms";
import { seedAchievements } from "@/data/seedPortfolioData";

export default function AdminAchievementsPage() {
  return <AdminLayout title="Achievements"><CollectionManager title="Achievements" collectionName="achievements" fields={achievementFields} seedRows={seedAchievements} /></AdminLayout>;
}
