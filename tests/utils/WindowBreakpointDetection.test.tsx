import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import {
  BREAKPOINTS,
  matchesWidth,
  matchesHeight,
  getCurrentWidthBreakpoint,
  getCurrentHeightBreakpoint,
  useBreakpoint,
  createBreakpointListener,
  getBreakpointState,
} from "utils/WindowBreakpointDetection";

type PartialMediaQueryList = Partial<MediaQueryList> & {
  addEventListener?: (
    event: string,
    listener: (e: MediaQueryListEvent) => void,
  ) => void;
  removeEventListener?: (
    event: string,
    listener: (e: MediaQueryListEvent) => void,
  ) => void;
};

describe("WindowBreakpointDetection", () => {
  let originalInnerWidth: number;
  let originalInnerHeight: number;
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
    originalMatchMedia = window.matchMedia;

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    window.innerHeight = originalInnerHeight;
    window.matchMedia = originalMatchMedia;
  });

  it("BREAKPOINTS contains correct width and height values", () => {
    expect(BREAKPOINTS).toEqual({
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      "2xl": 1536,
      "h-xs": 480,
      "h-sm": 640,
      "h-md": 768,
      "h-lg": 900,
      "h-xl": 1024,
    });
  });

  it("matchesWidth / matchesHeight works", () => {
    window.innerWidth = 1024;
    window.innerHeight = 768;

    expect(matchesWidth("lg")).toBe(true);
    expect(matchesWidth("xl")).toBe(false);

    expect(matchesHeight("h-md")).toBe(true);
    expect(matchesHeight("h-xl")).toBe(false);
  });

  it("getCurrentWidthBreakpoint / getCurrentHeightBreakpoint returns correct breakpoints", () => {
    window.innerWidth = 1024;
    window.innerHeight = 768;

    expect(getCurrentWidthBreakpoint()).toBe("lg");
    expect(getCurrentHeightBreakpoint()).toBe("h-md");

    window.innerWidth = 500;
    window.innerHeight = 400;

    expect(getCurrentWidthBreakpoint()).toBeNull();
    expect(getCurrentHeightBreakpoint()).toBeNull();
  });

  describe("useBreakpoint hook", () => {
    it("returns current breakpoints and match functions", () => {
      window.innerWidth = 1024;
      window.innerHeight = 768;

      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.width).toBe("lg");
      expect(result.current.height).toBe("h-md");
      expect(result.current.matchesWidth("lg")).toBe(true);
      expect(result.current.matchesHeight("h-md")).toBe(true);
    });

    it("updates on resize", async () => {
      window.innerWidth = 640;
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.width).toBe("sm");

      act(() => {
        window.innerWidth = 1280;
        window.dispatchEvent(new Event("resize"));
      });

      await waitFor(() => {
        expect(result.current.width).toBe("xl");
      });
    });

    it("cleans up on unmount", () => {
      const removeSpy = vi.spyOn(window, "removeEventListener");
      const { unmount } = renderHook(() => useBreakpoint());
      unmount();
      expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    });
  });

  describe("createBreakpointListener", () => {
    it("calls callback with initial state and sets up media query listener", () => {
      const callback = vi.fn();
      const removeListener = vi.fn();
      const mockMQ: PartialMediaQueryList = {
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: removeListener,
      };
      window.matchMedia = vi.fn().mockReturnValue(mockMQ as MediaQueryList);

      const cleanup = createBreakpointListener("lg", "width", callback);

      expect(callback).toHaveBeenCalledWith(true);
      expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 1024px)");

      cleanup();
      expect(removeListener).toHaveBeenCalled();
    });

    it("calls callback when media query change event fires", () => {
      const callback = vi.fn();
      const removeListener = vi.fn();
      let changeListener: ((e: MediaQueryListEvent) => void) | undefined;
      const mockMQ: PartialMediaQueryList = {
        matches: false,
        addEventListener: vi.fn((event, listener) => {
          if (event === "change") {
            changeListener = listener as (e: MediaQueryListEvent) => void;
          }
        }),
        removeEventListener: removeListener,
      };
      window.matchMedia = vi.fn().mockReturnValue(mockMQ as MediaQueryList);

      createBreakpointListener("lg", "width", callback);

      expect(callback).toHaveBeenCalledWith(false);

      changeListener?.({
        matches: true,
      } as MediaQueryListEvent);

      expect(callback).toHaveBeenLastCalledWith(true);
    });

    it("creates correct media query for width", () => {
      const callback = vi.fn();

      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      window.matchMedia = mockMatchMedia;

      createBreakpointListener("lg", "width", callback);

      expect(mockMatchMedia).toHaveBeenCalledWith("(min-width: 1024px)");
    });

    it("creates correct media query for height", () => {
      const callback = vi.fn();

      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      window.matchMedia = mockMatchMedia;

      createBreakpointListener("h-md", "height", callback);

      expect(mockMatchMedia).toHaveBeenCalledWith("(min-height: 768px)");
    });
  });

  describe("getBreakpointState", () => {
    it("returns correct state and matches objects", () => {
      window.innerWidth = 1024;
      window.innerHeight = 768;

      const state = getBreakpointState();

      expect(state.width.current).toBe("lg");
      expect(state.height.current).toBe("h-md");

      expect(state.width.matches).toEqual({
        sm: true,
        md: true,
        lg: true,
        xl: false,
        "2xl": false,
      });

      expect(state.height.matches).toEqual({
        "h-xs": true,
        "h-sm": true,
        "h-md": true,
        "h-lg": false,
        "h-xl": false,
      });
    });
  });
});
