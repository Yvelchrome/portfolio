"use client";

import { useEffect, useState } from "react";

import { hasWindow } from "utils/windowEnv";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (!hasWindow()) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (!hasWindow()) return;

    const mq = window.matchMedia(query);
    const update = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mq.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
    };
  }, [query]);

  return matches;
}
