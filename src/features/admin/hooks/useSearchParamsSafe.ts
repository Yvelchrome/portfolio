"use client";

import { useSearchParams } from "next/navigation";

function isString(value: unknown): value is string {
  return typeof value === "string";
}
/**
 * Safe hook to read multiple search params with defaults.
 * Always returns a string for each key.
 *
 * Usage:
 * ```ts
 * const { someParam } = useSearchParamsSafe(["someParam"], { someParam: "someValue" });
 * ```
 */
export function useSearchParamsSafe<T extends string>(
  keys: readonly T[],
  defaults?: Record<T, string>,
): Record<T, string> {
  const searchParams = useSearchParams();

  const result: Record<T, string> = {} as Record<T, string>;

  for (const key of keys) {
    const value = searchParams.get(key);
    result[key] = isString(value) ? value : (defaults?.[key] ?? "");
  }

  return result;
}
