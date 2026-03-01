import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useMounted } from "lib/hooks/useMounted";

describe("useMounted", () => {
  it("returns false initially", () => {
    const { result } = renderHook(() => useMounted());

    expect(result.current).toBe(false);
  });

  it("returns true after mount", () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useMounted());

    expect(result.current).toBe(false);

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current).toBe(true);

    vi.useRealTimers();
  });

  it("clears timeout on unmount", () => {
    const clearSpy = vi.spyOn(global, "clearTimeout");

    const { unmount } = renderHook(() => useMounted());
    unmount();

    expect(clearSpy).toHaveBeenCalled();
  });
});
