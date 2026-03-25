"use client";

import { useEffect, useState } from "react";

import { hasWindow } from "utils/HasWindow";

export const BREAKPOINTS = {
  // Width breakpoints (standard Tailwind)
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,

  // Height breakpoints (custom)
  "h-xs": 480,
  "h-sm": 640,
  "h-md": 768,
  "h-lg": 900,
  "h-xl": 1024,
} as const;
export type BreakpointKey = keyof typeof BREAKPOINTS;

const widthEntries = Object.entries(BREAKPOINTS).filter(
  ([key]) => !key.startsWith("h-"),
) as [BreakpointKey, number][];
const SORTED_WIDTH_BREAKPOINTS = [...widthEntries].sort((a, b) => b[1] - a[1]);

const heightEntries = Object.entries(BREAKPOINTS).filter(([key]) =>
  key.startsWith("h-"),
) as [BreakpointKey, number][];
const SORTED_HEIGHT_BREAKPOINTS = [...heightEntries].sort(
  (a, b) => b[1] - a[1],
);

/**
 * Check if current viewport matches a width breakpoint
 */
export function matchesWidth(breakpoint: BreakpointKey): boolean {
  if (!hasWindow()) return false;

  const value = BREAKPOINTS[breakpoint];
  return window.innerWidth >= value;
}

/**
 * Check if current viewport matches a height breakpoint
 */
export function matchesHeight(breakpoint: BreakpointKey): boolean {
  if (!hasWindow()) return false;

  const value = BREAKPOINTS[breakpoint];
  return window.innerHeight >= value;
}

/**
 * Get current active width breakpoint
 */
export function getCurrentWidthBreakpoint(): BreakpointKey | null {
  if (!hasWindow()) return null;

  const width = window.innerWidth;

  for (const entry of SORTED_WIDTH_BREAKPOINTS) {
    const [key, value] = entry;
    if (width >= value) return key;
  }

  return null;
}

/**
 * Get current active height breakpoint
 */
export function getCurrentHeightBreakpoint(): BreakpointKey | null {
  if (!hasWindow()) return null;

  const height = window.innerHeight;

  for (const entry of SORTED_HEIGHT_BREAKPOINTS) {
    const [key, value] = entry;
    if (height >= value) return key;
  }

  return null;
}

/**
 * Hook for React: Listen to breakpoint changes
 */
export function useBreakpoint() {
  const [state, setState] = useState({
    width: getCurrentWidthBreakpoint(),
    height: getCurrentHeightBreakpoint(),
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setState({
          width: getCurrentWidthBreakpoint(),
          height: getCurrentHeightBreakpoint(),
        });
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!hasWindow()) {
    return {
      width: null,
      height: null,
      matchesWidth: () => false,
      matchesHeight: () => false,
    };
  }

  return {
    width: state.width,
    height: state.height,
    matchesWidth,
    matchesHeight,
  };
}
