import { type Mock, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("locale.ts", () => {
  describe("getUserLocale", () => {
    it("returns defaultLocale when no cookie exists", async () => {
      const { cookies } = await import("next/headers");
      vi.mocked(cookies as Mock).mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      });

      const { getUserLocale } = await import("services/locale");
      const locale = await getUserLocale();
      expect(locale).toBe("en");
    });

    it("returns cookie value when set", async () => {
      const { cookies } = await import("next/headers");
      vi.mocked(cookies as Mock).mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: "fr" }),
      });

      const { getUserLocale } = await import("services/locale");
      const locale = await getUserLocale();
      expect(locale).toBe("fr");
    });
  });

  describe("setUserLocale", () => {
    it("sets the cookie correctly", async () => {
      const { cookies } = await import("next/headers");
      const setSpy = vi.fn();
      vi.mocked(cookies as Mock).mockResolvedValue({
        set: setSpy,
      });

      const { setUserLocale } = await import("services/locale");
      await setUserLocale("fr");

      expect(setSpy).toHaveBeenCalledWith("NEXT_LOCALE", "fr");
    });
  });
});
