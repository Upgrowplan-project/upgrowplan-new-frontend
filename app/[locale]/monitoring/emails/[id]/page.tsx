"use client";

import AdminGuard from "@/app/monitoring/components/AdminGuard";
import EmailView from "@/app/monitoring/pages/EmailView";

export default function EmailViewPage() {
  return (
    <AdminGuard>
      <EmailView />
    </AdminGuard>
  );
}
