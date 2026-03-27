import { Suspense } from "react";

import { StatsClient } from "features/admin/components/StatsClient";

function StatsFallback() {
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="bg-muted h-8 w-40 animate-pulse rounded" />
        <div className="bg-muted h-10 w-32 animate-pulse rounded" />
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-card flex min-h-64 items-center justify-center overflow-hidden rounded-lg p-4 shadow sm:min-h-75 sm:p-6">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
        <div className="bg-card flex min-h-64 items-center justify-center overflow-hidden rounded-lg p-4 shadow sm:min-h-75 sm:p-6">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      </div>

      <div className="bg-card mt-6 overflow-hidden rounded-lg p-4 shadow sm:mt-8 sm:p-6">
        <div className="bg-muted mb-3 h-5 w-32 animate-pulse rounded sm:mb-4 sm:h-6 sm:w-40" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-muted/50 rounded p-3 text-center sm:p-4">
              <div className="bg-muted mx-auto h-3 w-12 animate-pulse rounded sm:h-4 sm:w-16" />
              <div className="bg-muted mx-auto mt-1 h-5 w-8 animate-pulse rounded sm:mt-2 sm:h-8 sm:w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EmailStatsPage() {
  return (
    <Suspense fallback={<StatsFallback />}>
      <StatsClient />
    </Suspense>
  );
}
