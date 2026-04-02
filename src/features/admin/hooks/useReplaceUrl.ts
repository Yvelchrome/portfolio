"use client";

import { usePathname, useRouter } from "next/navigation";

/**
 * Replace current URL search params with the given key-value pairs.
 * Automatically keeps `demo=1` if isDemo is true.
 *
 * Usage:
 * ```ts
 * const replaceUrl = useReplaceUrl(isDemo);
 *
 * replaceUrl({ someParam: "someValue", anotherParam: "anotherValue" });
 * ```
 */
export function useReplaceUrl(isDemo: boolean) {
  const router = useRouter();
  const pathname = usePathname();

  return (params: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (!value || value === "") {
        searchParams.delete(key);
      } else if (!!value) {
        searchParams.set(key, String(value));
      }
    }

    if (isDemo) {
      searchParams.set("demo", "1");
    }

    const paramString = searchParams.toString();
    router.replace(paramString ? `${pathname}?${paramString}` : pathname);
  };
}
