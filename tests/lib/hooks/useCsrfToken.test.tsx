import { describe, it, expect, Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCsrfToken } from "lib/hooks/useCsrfToken";

describe("useCsrfToken", () => {
  it("fetches CSRF token on mount", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => Promise.resolve({ csrfToken: "test-token-123" }),
    });

    const { result } = renderHook(() => useCsrfToken());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.csrfToken).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.csrfToken).toBe("test-token-123");
    expect(result.current.error).toBe(null);
    expect(global.fetch).toHaveBeenCalledWith("/api/csrf-token");
  });

  it("handles HTTP error", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const { result } = renderHook(() => useCsrfToken());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.csrfToken).toBe(null);
    expect(result.current.error).toMatch(/HTTP Error: 500/i);
  });

  it("handles validation error (empty token)", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => Promise.resolve({ csrfToken: "" }),
    });

    const { result } = renderHook(() => useCsrfToken());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.csrfToken).toBe(null);
    expect(result.current.error).toMatch(/validation failed/i);
  });

  it("handles invalid response format", async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => Promise.resolve({ wrong: "format" }),
    });

    const { result } = renderHook(() => useCsrfToken());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.csrfToken).toBe(null);
    expect(result.current.error).toBeTruthy();
  });

  it("handles errorMessage when error IS an instanceof Error", async () => {
    (global.fetch as Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useCsrfToken());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.csrfToken).toBe(null);
    expect(result.current.error).toBe("Network error");
  });

  it("handles errorMessage when error IS NOT an instanceof Error ", async () => {
    (global.fetch as Mock).mockRejectedValueOnce("Unexpected error");

    const { result } = renderHook(() => useCsrfToken());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.csrfToken).toBe(null);
    expect(result.current.error).toMatch(/failed to fetch/i);
  });

  it("only fetches once on mount", async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => Promise.resolve({ csrfToken: "token" }),
    });

    const { rerender } = renderHook(() => useCsrfToken());

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    rerender();

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
