import { describe, expect, it, vi } from "vitest";

import {
  ACCESS_TOKEN_EXPIRY,
  type JWTPayload,
  REFRESH_TOKEN_EXPIRY,
  type RefreshPayload,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "lib/auth/jwt";

describe("JWT Environment Validation", () => {
  it("should throw when JWT_SECRET is not set", async () => {
    vi.resetModules();
    vi.stubEnv("JWT_SECRET", "");
    vi.stubEnv("JWT_REFRESH_SECRET", "this-is-a-valid-secret-key-32chars");

    await expect(() => import("lib/auth/jwt")).rejects.toThrow(
      "JWT_SECRET environment variable is required but not set",
    );
  });

  it("should throw when JWT_REFRESH_SECRET is not set", async () => {
    vi.resetModules();
    vi.stubEnv("JWT_SECRET", "this-is-a-valid-secret-key-32chars");
    vi.stubEnv("JWT_REFRESH_SECRET", "");

    await expect(() => import("lib/auth/jwt")).rejects.toThrow(
      "JWT_REFRESH_SECRET environment variable is required but not set",
    );
  });

  it("should throw when JWT_SECRET and JWT_REFRESH_SECRET are equal", async () => {
    vi.resetModules();
    vi.stubEnv("JWT_SECRET", "same-secret-value-here-32-chars!");
    vi.stubEnv("JWT_REFRESH_SECRET", "same-secret-value-here-32-chars!");

    await expect(() => import("lib/auth/jwt")).rejects.toThrow(
      "JWT_SECRET and JWT_REFRESH_SECRET must have different values",
    );
  });

  it("should throw when JWT_SECRET is less than 32 characters", async () => {
    vi.resetModules();
    vi.stubEnv("JWT_SECRET", "short-secret");
    vi.stubEnv("JWT_REFRESH_SECRET", "this-is-a-valid-secret-key-32chars");

    await expect(() => import("lib/auth/jwt")).rejects.toThrow(
      "JWT_SECRET must be at least 32 characters long",
    );
  });

  it("should throw when JWT_REFRESH_SECRET is less than 32 characters", async () => {
    vi.resetModules();
    vi.stubEnv("JWT_SECRET", "this-is-a-valid-secret-key-32chars");
    vi.stubEnv("JWT_REFRESH_SECRET", "short-secret");

    await expect(() => import("lib/auth/jwt")).rejects.toThrow(
      "JWT_REFRESH_SECRET must be at least 32 characters long",
    );
  });
});

describe("JWT Authentication", () => {
  const validPayload: JWTPayload = {
    sub: "user123",
    email: "admin@example.com",
    role: "ADMIN",
  };

  describe("signAccessToken & verifyAccessToken", () => {
    it("should sign and verify a valid access token", () => {
      const token = signAccessToken(validPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");

      const decoded = verifyAccessToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.sub).toBe("user123");
      expect(decoded?.email).toBe("admin@example.com");
      expect(decoded?.role).toBe("ADMIN");
    });

    it.each`
      token                   | description
      ${"invalid.token.here"} | ${"invalid format"}
      ${""}                   | ${"empty string"}
    `("should return null for $description", ({ token }: { token: string }) => {
      expect(verifyAccessToken(token)).toBeNull();
    });

    it("should return null for token with wrong role", () => {
      const token = signAccessToken({
        ...validPayload,
        role: "USER",
      } as JWTPayload);
      expect(verifyAccessToken(token)).toBeNull();
    });
  });

  describe("verifyRefreshToken", () => {
    it("should return null for empty token", () => {
      const result = verifyAccessToken("");
      expect(result).toBeNull();
    });

    it("should return null for token with wrong role", () => {
      const payload = {
        sub: "user123",
        email: "user@example.com",
        role: "USER",
      };

      const token = signAccessToken(payload as JWTPayload);
      const result = verifyAccessToken(token);

      expect(result).toBeNull();
    });
  });

  describe("signRefreshToken & verifyRefreshToken", () => {
    const refreshPayload: RefreshPayload = {
      sub: "user123",
      email: "admin@example.com",
      role: "ADMIN",
      type: "refresh",
    };

    it("should sign and verify a valid refresh token", () => {
      const token = signRefreshToken(refreshPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");

      const decoded = verifyRefreshToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.sub).toBe("user123");
      expect(decoded?.type).toBe("refresh");
    });

    it.each`
      token                            | description
      ${"invalid.refresh.token"}       | ${"invalid format"}
      ${signAccessToken(validPayload)} | ${"access token used as refresh"}
    `("should return null for $description", ({ token }: { token: string }) => {
      expect(verifyRefreshToken(token)).toBeNull();
    });
  });

  describe("Token Expiry", () => {
    it.each`
      expiry                  | expected
      ${ACCESS_TOKEN_EXPIRY}  | ${"30m"}
      ${REFRESH_TOKEN_EXPIRY} | ${"1d"}
    `("should have correct expiry values", ({ expiry, expected }) => {
      expect(expiry).toBe(expected);
    });
  });
});
