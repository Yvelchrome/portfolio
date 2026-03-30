import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createAuthRequest,
  createRequest,
} from "tests/__mocks__/createMockRequest";

import { GET as statisticsGet } from "app/api/admin/statistics/route";
import { signAccessToken } from "lib/auth/jwt";

const { mockResendInstance, mockEmailsList } = vi.hoisted(() => {
  const mockEmailsList = vi.fn().mockResolvedValue({
    data: {
      data: [
        {
          id: "email1",
          last_event: "delivered" as const,
          created_at: new Date().toISOString(),
        },
        {
          id: "email2",
          last_event: "delivered" as const,
          created_at: new Date().toISOString(),
        },
        {
          id: "email3",
          last_event: "sent" as const,
          created_at: new Date().toISOString(),
        },
      ],
    },
    error: null,
  });

  const mockResendInstance = {
    emails: {
      list: mockEmailsList,
    },
  };

  return { mockResendInstance, mockEmailsList };
});

vi.mock("resend", () => ({
  Resend: class {
    emails = mockResendInstance.emails;
  },
}));

const adminToken = signAccessToken({
  sub: "admin123",
  email: "admin@example.com",
  role: "ADMIN",
});

describe("GET /api/admin/statistics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEmailsList.mockReset();
  });

  it("should return 401 without token", async () => {
    const request = createRequest("/api/admin/statistics");
    const response = await statisticsGet(request);
    expect(response.status).toBe(401);
  });

  it("should return 500 when RESEND_API_KEY is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");

    const request = createAuthRequest("/api/admin/statistics", adminToken);
    const response = await statisticsGet(request);
    const data = (await response.json()) as { error: string };

    expect(response.status).toBe(500);
    expect(data.error).toContain("RESEND_API_KEY");
  });

  it("should return demo statistics in demo mode", async () => {
    const request = createAuthRequest(
      "/api/admin/statistics?demo=1",
      adminToken,
    );
    const response = await statisticsGet(request);
    const data = (await response.json()) as {
      summary: {
        totalSent: number;
        sent: number;
        delivered: number;
        bounced: number;
        failed: number;
      };
    };

    expect(response.status).toBe(200);
    expect(data.summary.totalSent).toBe(13);
    expect(data.summary.sent).toBe(3);
    expect(data.summary.delivered).toBe(8);
    expect(data.summary.bounced).toBe(1);
    expect(data.summary.failed).toBe(1);
  });

  it("should return real statistics when Resend API is available", async () => {
    mockEmailsList.mockResolvedValue({
      data: {
        data: [
          {
            id: "email1",
            last_event: "delivered" as const,
            created_at: new Date().toISOString(),
          },
        ],
      },
      error: null,
    });

    const request = createAuthRequest(
      "/api/admin/statistics?days=7",
      adminToken,
    );
    const response = await statisticsGet(request);

    expect(response.status).toBe(200);
  });

  it("should return 500 when Resend API returns error", async () => {
    mockEmailsList.mockResolvedValue({
      data: null,
      error: {
        name: "RESEND_ERROR",
        message: "Failed to fetch emails",
      },
    });

    const request = createAuthRequest(
      "/api/admin/statistics?days=7",
      adminToken,
    );
    const response = await statisticsGet(request);
    const data = (await response.json()) as { error: string };

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch from Resend");
  });

  it("should handle general catch block error", async () => {
    mockEmailsList.mockImplementation(() => {
      throw new Error("Unexpected Resend error");
    });

    const request = createAuthRequest(
      "/api/admin/statistics?days=7",
      adminToken,
    );
    const response = await statisticsGet(request);
    const data = (await response.json()) as { error: string };

    expect(response.status).toBe(500);
    expect(data.error).toBe("Server error");
  });

  it("should filter out emails older than startDate", async () => {
    const oldDate = new Date(
      Date.now() - 90 * 24 * 60 * 60 * 1000,
    ).toISOString();

    mockEmailsList.mockResolvedValue({
      data: {
        data: [
          {
            id: "email_old",
            last_event: "delivered" as const,
            created_at: oldDate,
          },
        ],
      },
      error: null,
    });

    const request = createAuthRequest(
      "/api/admin/statistics?days=60",
      adminToken,
    );
    const response = await statisticsGet(request);
    const data = (await response.json()) as {
      summary: { sent: number; delivered: number };
    };

    expect(response.status).toBe(200);
    expect(data.summary.sent).toBe(0);
    expect(data.summary.delivered).toBe(0);
  });

  it("should handle unknown event types in email list", async () => {
    mockEmailsList.mockResolvedValue({
      data: {
        data: [
          {
            id: "email1",
            last_event: "opened" as const,
            created_at: new Date().toISOString(),
          },
          {
            id: "email2",
            last_event: "clicked" as const,
            created_at: new Date().toISOString(),
          },
        ],
      },
      error: null,
    });

    const request = createAuthRequest(
      "/api/admin/statistics?days=7",
      adminToken,
    );
    const response = await statisticsGet(request);
    const data = (await response.json()) as {
      summary: { sent: number; delivered: number };
    };

    expect(response.status).toBe(200);
    expect(data.summary.sent).toBe(0);
    expect(data.summary.delivered).toBe(0);
  });

  it("should cover nullish coalescing in loop - event in counts but null value", async () => {
    mockEmailsList.mockResolvedValue({
      data: {
        data: [
          {
            id: "email1",
            last_event: "delivered" as const,
            created_at: new Date().toISOString(),
          },
          {
            id: "email2",
            last_event: "sent" as const,
            created_at: new Date().toISOString(),
          },
        ],
      },
      error: null,
    });

    const request = createAuthRequest(
      "/api/admin/statistics?days=7",
      adminToken,
    );
    const response = await statisticsGet(request);
    const data = (await response.json()) as {
      summary: { sent: number; delivered: number };
    };

    expect(response.status).toBe(200);
    expect(data.summary.delivered).toBeGreaterThan(0);
    expect(data.summary.sent).toBeGreaterThan(0);
  });

  it("should cover nullish coalescing fallback with undefined counts", async () => {
    const oldDate = new Date(
      Date.now() - 100 * 24 * 60 * 60 * 1000,
    ).toISOString();

    mockEmailsList.mockResolvedValue({
      data: {
        data: [
          {
            id: "email_old1",
            last_event: "delivered" as const,
            created_at: oldDate,
          },
          {
            id: "email_old2",
            last_event: "sent" as const,
            created_at: oldDate,
          },
        ],
      },
      error: null,
    });

    const request = createAuthRequest(
      "/api/admin/statistics?days=30",
      adminToken,
    );
    const response = await statisticsGet(request);
    const data = (await response.json()) as {
      summary: {
        sent: number;
        delivered: number;
        bounced: number;
        failed: number;
        totalSent: number;
      };
    };

    expect(response.status).toBe(200);
    expect(data.summary.sent).toBe(0);
    expect(data.summary.delivered).toBe(0);
    expect(data.summary.bounced).toBe(0);
    expect(data.summary.failed).toBe(0);
    expect(data.summary.totalSent).toBe(0);
  });

  it("should cover mixed date scenarios - some in range, some out", async () => {
    const now = new Date();
    const oldDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    mockEmailsList.mockResolvedValue({
      data: {
        data: [
          {
            id: "email_in_range",
            last_event: "delivered" as const,
            created_at: now.toISOString(),
          },
          {
            id: "email_out_of_range",
            last_event: "sent" as const,
            created_at: oldDate.toISOString(),
          },
        ],
      },
      error: null,
    });

    const request = createAuthRequest(
      "/api/admin/statistics?days=30",
      adminToken,
    );
    const response = await statisticsGet(request);
    const data = (await response.json()) as {
      summary: { delivered: number; sent: number };
    };

    expect(response.status).toBe(200);
    expect(data.summary.delivered).toBe(1);
    expect(data.summary.sent).toBe(0);
  });
});
