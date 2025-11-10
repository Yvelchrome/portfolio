"use client";

import { useEffect, useState } from "react";

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

/**
 * Check if current viewport matches a width breakpoint
 */
export function matchesWidth(breakpoint: BreakpointKey): boolean {
  if (typeof window === "undefined") return false;

  const value = BREAKPOINTS[breakpoint];
  return window.innerWidth >= value;
}

/**
 * Check if current viewport matches a height breakpoint
 */
export function matchesHeight(breakpoint: BreakpointKey): boolean {
  if (typeof window === "undefined") return false;

  const value = BREAKPOINTS[breakpoint];
  return window.innerHeight >= value;
}

/**
 * Get current active width breakpoint
 */
export function getCurrentWidthBreakpoint(): BreakpointKey | null {
  if (typeof window === "undefined") return null;

  const width = window.innerWidth;
  const widthBreakpoints = Object.entries(BREAKPOINTS)
    .filter(([key]) => !key.startsWith("h-"))
    .sort(([, a], [, b]) => b - a);

  for (const [key, value] of widthBreakpoints) {
    if (width >= value) {
      return key as BreakpointKey;
    }
  }

  return null;
}

/**
 * Get current active height breakpoint
 */
export function getCurrentHeightBreakpoint(): BreakpointKey | null {
  if (typeof window === "undefined") return null;

  const height = window.innerHeight;
  const heightBreakpoints = Object.entries(BREAKPOINTS)
    .filter(([key]) => key.startsWith("h-"))
    .sort(([, a], [, b]) => b - a);

  for (const [key, value] of heightBreakpoints) {
    if (height >= value) {
      return key as BreakpointKey;
    }
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

  if (typeof window === "undefined") {
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

/**
 * Create a media query listener for specific breakpoint
 */
export function createBreakpointListener(
  breakpoint: BreakpointKey,
  dimension: "width" | "height",
  callback: (matches: boolean) => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const value = BREAKPOINTS[breakpoint];
  const query =
    dimension === "width"
      ? `(min-width: ${value}px)`
      : `(min-height: ${value}px)`;

  const mediaQuery = window.matchMedia(query);

  callback(mediaQuery.matches);

  const handler = (e: MediaQueryListEvent) => callback(e.matches);
  mediaQuery.addEventListener("change", handler);

  return () => mediaQuery.removeEventListener("change", handler);
}

/**
 * Vanilla JS utility: Check multiple breakpoints at once
 */
export function getBreakpointState() {
  if (typeof window === "undefined") {
    return {
      width: { current: null, matches: {} },
      height: { current: null, matches: {} },
    };
  }

  const widthMatches: Record<string, boolean> = {};
  const heightMatches: Record<string, boolean> = {};

  Object.entries(BREAKPOINTS).forEach(([key, value]) => {
    if (key.startsWith("h-")) {
      heightMatches[key] = window.innerHeight >= value;
    } else {
      widthMatches[key] = window.innerWidth >= value;
    }
  });

  return {
    width: {
      current: getCurrentWidthBreakpoint(),
      matches: widthMatches,
    },
    height: {
      current: getCurrentHeightBreakpoint(),
      matches: heightMatches,
    },
  };
}

// Usage Examples:

// 1. Simple check
// if (matchesWidth('md')) { ... }
// if (matchesHeight('h-lg')) { ... }

// 2. Get current breakpoint
// const currentWidth = getCurrentWidthBreakpoint(); // 'lg'
// const currentHeight = getCurrentHeightBreakpoint(); // 'h-md'

// 3. React Hook
// function MyComponent() {
//   const { width, height, matchesWidth, matchesHeight } = useBreakpoint();
//
//   return (
//     <div>
//       <p>Width: {width}</p>
//       <p>Height: {height}</p>
//       {matchesWidth('lg') && <p>Large screen!</p>}
//       {matchesHeight('h-lg') && <p>Tall screen!</p>}
//     </div>
//   );
// }

// 4. Listener pattern
// const cleanup = createBreakpointListener('lg', 'width', (matches) => {
//   console.log('Large width:', matches);
// });
// cleanup(); // Remove listener when done

// 5. Get all breakpoint states
// const state = getBreakpointState();
// console.log(state.width.matches.md); // true/false
// console.log(state.height.matches['h-lg']); // true/false
