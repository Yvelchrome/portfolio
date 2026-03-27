import { Suspense } from "react";

import { DashboardClient } from "features/admin/components";

function DashboardFallback() {
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="bg-muted h-8 w-40 animate-pulse rounded" />
          <div className="bg-muted mt-2 h-4 w-60 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-10 w-24 animate-pulse rounded" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-3">
        {["stat-1", "stat-2", "stat-3"].map((id) => (
          <div
            key={id}
            className="bg-card overflow-hidden rounded-lg p-4 shadow sm:p-6"
          >
            <div className="bg-muted h-4 w-24 animate-pulse rounded" />
            <div className="bg-muted mt-2 h-8 w-16 animate-pulse rounded" />
          </div>
        ))}
      </div>

      <div className="bg-card overflow-hidden rounded-lg shadow">
        <div className="border-border flex items-center justify-between border-b p-4 sm:p-6">
          <div className="bg-muted h-5 w-32 animate-pulse rounded" />
          <div className="bg-muted h-4 w-20 animate-pulse rounded" />
        </div>
        <div className="p-6">
          <div className="bg-muted h-20 w-full animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardClient />
    </Suspense>
  );
}
