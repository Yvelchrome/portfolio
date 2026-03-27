import { Suspense } from "react";

import { AdminNavClient } from "features/admin/components";

function AdminNavFallback() {
  return (
    <nav className="bg-card mx-4 mt-4 overflow-x-auto rounded-lg px-3 py-3 shadow sm:mx-8 sm:mt-8 sm:w-fit sm:px-4 sm:py-4">
      <div className="flex min-w-max flex-col gap-2 sm:min-w-0 sm:flex-row sm:items-center sm:gap-8">
        <div className="bg-muted h-6 w-20 animate-pulse rounded" />
        <div className="bg-muted h-6 w-24 animate-pulse rounded" />
        <div className="bg-muted h-6 w-24 animate-pulse rounded" />
      </div>
    </nav>
  );
}

export function AdminNav() {
  return (
    <Suspense fallback={<AdminNavFallback />}>
      <AdminNavClient />
    </Suspense>
  );
}
