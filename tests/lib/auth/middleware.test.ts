import { describe, expect, it, vi } from "vitest";

import { NextRequest, NextResponse } from "next/server";

import { signAccessToken } from "lib/auth/jwt";
import * as jwtModule from "lib/auth/jwt";
import { requireAdmin, requireAuth } from "lib/auth/middleware";

describe("Auth Middleware", () => {
  const createMockRequest = (accessToken?: string): NextRequest => {
    const request = new NextRequest("http://localhost:3000/api/test", {
      headers: {},
    });

    // Mock the cookies.get method
    const cookieGetMock = vi.fn((name: string) => {
      if (name === "accessToken" && accessToken) {
        return {
          name: "accessToken",
          value: accessToken,
          path: "/",
          httpOnly: true,
        };
      }
      return undefined;
    });

    // Replace the cookies.get method
    Object.defineProperty(request.cookies, "get", {
      value: cookieGetMock,
      writable: true,
    });

    return request;
  };

  describe.each`
    middleware      | tokenValue
    ${requireAuth}  | ${undefined}
    ${requireAdmin} | ${undefined}
  `(
    "$middleware.name",
    ({
      middleware,
      tokenValue,
    }: {
      middleware: (
        req: NextRequest,
      ) =>
        | NextResponse
        | { user: { sub: string; email: string; role: string } };
      tokenValue: string | undefined;
    }) => {
      it("should return 401 when no token", () => {
        const request = createMockRequest(tokenValue);
        const result = middleware(request);
        expect(result).toBeInstanceOf(NextResponse);
        expect((result as NextResponse).status).toBe(401);
      });

      it("should return 401 when token is invalid", () => {
        const request = createMockRequest("invalid-token");
        const result = middleware(request);
        expect(result).toBeInstanceOf(NextResponse);
        expect((result as NextResponse).status).toBe(401);
      });
    },
  );

  describe("requireAuth", () => {
    it("should return user payload when token is valid", () => {
      const token = signAccessToken({
        sub: "user123",
        email: "admin@example.com",
        role: "ADMIN",
      });
      const request = createMockRequest(token);
      const result = requireAuth(request);

      expect(result).not.toBeInstanceOf(NextResponse);
      if ("user" in result) {
        expect(result.user.sub).toBe("user123");
        expect(result.user.email).toBe("admin@example.com");
        expect(result.user.role).toBe("ADMIN");
      }
    });
  });

  describe("requireAdmin", () => {
    it("should return 401 when token has invalid role (schema rejects)", () => {
      const token = signAccessToken({
        sub: "user123",
        email: "user@example.com",
        role: "USER",
      });
      const request = createMockRequest(token);
      const result = requireAdmin(request);

      expect(result).toBeInstanceOf(NextResponse);
      expect((result as NextResponse).status).toBe(401);
    });

    it("should return 403 when token has valid signature but non-ADMIN role", () => {
      const spy = vi.spyOn(jwtModule, "verifyAccessToken");
      spy.mockReturnValue({
        sub: "user123",
        email: "user@example.com",
        role: "USER",
      });

      const request = createMockRequest("any-token");
      const result = requireAdmin(request);

      expect(result).toBeInstanceOf(NextResponse);
      const response = result as NextResponse;
      expect(response.status).toBe(403);
      expect(response.status).not.toBe(401);

      spy.mockRestore();
    });

    it("should return user payload when role is ADMIN", () => {
      const token = signAccessToken({
        sub: "user123",
        email: "admin@example.com",
        role: "ADMIN",
      });
      const request = createMockRequest(token);
      const result = requireAdmin(request);

      expect(result).not.toBeInstanceOf(NextResponse);
      if ("user" in result) {
        expect(result.user.sub).toBe("user123");
        expect(result.user.role).toBe("ADMIN");
      }
    });
  });
});
