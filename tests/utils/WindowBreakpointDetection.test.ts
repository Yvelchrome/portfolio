import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  BREAKPOINTS,
  getCurrentHeightBreakpoint,
  getCurrentWidthBreakpoint,
  matchesHeight,
  matchesWidth,
  useBreakpoint,
} from "utils/WindowBreakpointDetection";
import * as WindowEnv from "utils/windowEnv";

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

  describe("SSR checks | Mock window = undefined", () => {
    it("matchesWidth / matchesHeight returns false", () => {
      vi.spyOn(WindowEnv, "hasWindow").mockReturnValue(false);

      expect(matchesWidth("lg")).toBe(false);
      expect(matchesHeight("h-lg")).toBe(false);
    });

    it("getCurrentWidthBreakpoint / getCurrentHeightBreakpoint returns false", () => {
      vi.spyOn(WindowEnv, "hasWindow").mockReturnValue(false);

      expect(getCurrentWidthBreakpoint()).toBeNull();
      expect(getCurrentHeightBreakpoint()).toBeNull();
    });

    it("useBreakpoint hook returns safe defaults", () => {
      vi.spyOn(WindowEnv, "hasWindow").mockReturnValue(false);

      const { result } = renderHook(() => useBreakpoint());

      expect(result.current.width).toBeNull();
      expect(result.current.height).toBeNull();
      expect(result.current.matchesWidth("lg")).toBe(false);
      expect(result.current.matchesHeight("h-lg")).toBe(false);
    });
  });
});
