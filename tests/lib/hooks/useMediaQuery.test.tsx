import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockBrowser, mockSSR } from "tests/__mocks__/ssr";

import { useMediaQuery } from "hooks/useMediaQuery";

describe("useMediaQuery", () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  const createMatchMediaMock = (matches: boolean) => {
    let listener: ((ev: MediaQueryListEvent) => void) | null = null;

    window.matchMedia = vi.fn((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(
        (_: string, handler: EventListenerOrEventListenerObject) => {
          listener = handler as (ev: MediaQueryListEvent) => void;
        },
      ),
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

  it.each`
    matches  | description
    ${true}  | ${"matches"}
    ${false} | ${"does not match"}
  `(
    "returns $description for (min-width: 768px)",
    ({ matches }: { matches: boolean }) => {
      createMatchMediaMock(matches);
      const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
      expect(result.current).toBe(matches);
    },
  );

  it("updates when media query changes", () => {
    const triggerListener = createMatchMediaMock(false);

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

    window.matchMedia = vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as typeof window.matchMedia;

    const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    unmount();

    expect(removeEventListener).toHaveBeenCalled();
  });

  describe("SSR checks", () => {
    it("returns false when window is undefined", () => {
      mockSSR();

      const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
      expect(result.current).toBe(false);

      mockBrowser();
    });
  });
});
