"use client";

import { usePathname } from "next/navigation";

export const useHideOnRoute = (routes: string[]) => {
  const pathname = usePathname();

  return routes.some((route) => pathname.startsWith(route));
};
