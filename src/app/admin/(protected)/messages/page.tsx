import { Suspense } from "react";

import { MessagesClient } from "features/admin/components";

function MessagesFallback() {
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="bg-muted h-8 w-40 animate-pulse rounded" />
        <div className="bg-muted h-10 w-32 animate-pulse rounded" />
      </div>
      <div className="bg-card overflow-hidden rounded-lg shadow">
        <div className="divide-border divide-y">
          {["msg-1", "msg-2", "msg-3", "msg-4", "msg-5"].map((id) => (
            <div key={id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                  <div className="bg-muted mt-1 h-3 w-40 animate-pulse rounded" />
                </div>
              </div>
              <div className="bg-muted mt-2 h-4 w-3/4 animate-pulse rounded" />
              <div className="bg-muted mt-1 h-3 w-24 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<MessagesFallback />}>
      <MessagesClient />
    </Suspense>
  );
}
