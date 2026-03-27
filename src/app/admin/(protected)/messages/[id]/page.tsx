import { Suspense } from "react";

import { MessageDetailClient } from "features/admin/components";

function MessageDetailFallback() {
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <div className="bg-muted h-6 w-20 animate-pulse rounded" />
      <div className="bg-card mt-4 overflow-hidden rounded-lg p-4 shadow sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="bg-muted h-8 w-3/4 animate-pulse rounded" />
            <div className="bg-muted mt-2 h-4 w-48 animate-pulse rounded" />
            <div className="bg-muted mt-1 h-4 w-56 animate-pulse rounded" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-muted h-4 w-full animate-pulse rounded" />
          <div className="bg-muted h-4 w-full animate-pulse rounded" />
          <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

export default function MessageDetailPage() {
  return (
    <Suspense fallback={<MessageDetailFallback />}>
      <MessageDetailClient />
    </Suspense>
  );
}
