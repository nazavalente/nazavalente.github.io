import { AdminLayout } from "@/components/admin/AdminLayout";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { messageFields } from "@/components/admin/forms";

export default function AdminMessagesPage() {
  return <AdminLayout title="Messages"><CollectionManager title="Messages" collectionName="contactMessages" fields={messageFields} /></AdminLayout>;
}
