"use client";

import { MonitoringDashboard } from '@/app/monitoring/pages/MonitoringDashboard';
import AdminGuard from '@/app/monitoring/components/AdminGuard';

export default function MonitoringPage() {
  return (
    <AdminGuard>
      <MonitoringDashboard />
    </AdminGuard>
  );
}
