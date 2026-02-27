import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMediaQuery } from "lib/hooks/useMediaQuery";

describe("useMediaQuery", () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  const mockMatchMedia = (initialMatches: boolean) => {
    let listener: ((ev: MediaQueryListEvent) => void) | null = null;

    window.matchMedia = ((query: string): MediaQueryList => ({
      matches: initialMatches,
      media: query,
      addEventListener: (
        _: string,
        handler: EventListenerOrEventListenerObject,
      ) => {
        listener = handler as (ev: MediaQueryListEvent) => void;
      },
      removeEventListener: vi.fn(),
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as typeof window.matchMedia;

    return (event: MediaQueryListEvent) => {
      if (listener) listener(event);
    };
  };

  const testCases = [
    { query: "(min-width: 768px)", matches: true },
    { query: "(min-width: 768px)", matches: false },
  ];

  testCases.forEach(({ query, matches }) => {
    it(`returns ${String(matches)} when query ${matches ? "matches" : "does not match"}`, () => {
      mockMatchMedia(matches);
      const { result } = renderHook(() => useMediaQuery(query));
      expect(result.current).toBe(matches);
    });
  });

  it("updates when media query changes", () => {
    const triggerListener = mockMatchMedia(false);

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(false);

    act(() => {
      triggerListener({
        matches: true,
        media: "(min-width: 768px)",
      } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });

  it("removes listener on unmount", () => {
    const removeEventListener = vi.fn();

    window.matchMedia = ((query: string) =>
      ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as MediaQueryList) as typeof window.matchMedia;

    const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    unmount();

    expect(removeEventListener).toHaveBeenCalled();
  });
});
