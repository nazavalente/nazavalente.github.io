import { AdminLayout } from "@/components/admin/AdminLayout";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { certificateFields } from "@/components/admin/forms";
import { seedCertificates } from "@/data/seedPortfolioData";

export default function AdminCertificatesPage() {
  return <AdminLayout title="Certificates"><CollectionManager title="Certificates" collectionName="certificates" fields={certificateFields} seedRows={seedCertificates} /></AdminLayout>;
}
