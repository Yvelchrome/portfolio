import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createAuthRequest,
  createRequest,
} from "tests/__mocks__/createMockRequest";

import { GET as messageStatsGet } from "app/api/admin/messages/stats/route";
import { signAccessToken } from "lib/auth/jwt";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    message: {
      count: vi.fn(),
    },
  },
}));

vi.mock("lib/prisma/prisma", () => ({
  prisma: mockPrisma,
}));

const adminToken = signAccessToken({
  sub: "admin123",
  email: "admin@example.com",
  role: "ADMIN",
});

describe("GET /api/admin/messages/stats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 without token", async () => {
    const request = createRequest("/api/admin/messages/stats");
    const response = await messageStatsGet(request);
    expect(response.status).toBe(401);
  });

  it("should return message stats", async () => {
    mockPrisma.message.count.mockResolvedValue(100);

    const request = createAuthRequest("/api/admin/messages/stats", adminToken);
    const response = await messageStatsGet(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("total");
    expect(data).toHaveProperty("unread");
    expect(data).toHaveProperty("replied");
  });

  it("should return demo stats in demo mode", async () => {
    const request = createAuthRequest(
      "/api/admin/messages/stats?demo=1",
      adminToken,
    );
    const response = await messageStatsGet(request);
    const data = (await response.json()) as {
      total: number;
      unread: number;
      replied: number;
    };

    expect(response.status).toBe(200);
    expect(data.total).toBe(67);
    expect(data.unread).toBe(25);
    expect(data.replied).toBe(42);
  });

  it("should handle server error", async () => {
    mockPrisma.message.count.mockRejectedValue(new Error("DB error"));

    const request = createAuthRequest("/api/admin/messages/stats", adminToken);
    const response = await messageStatsGet(request);

    expect(response.status).toBe(500);
  });
});
