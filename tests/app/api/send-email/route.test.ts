import { NextRequest } from "next/server";

import { describe, expect, it, vi } from "vitest";

import { POST } from "app/api/send-email/route";
import { ApiResponseSchema } from "lib/schemas";

process.env["CSRF_SECRET"] = "test-csrf-secret";
process.env["RESEND_API_KEY"] = "test-resend-key";
process.env["TARGET_EMAIL"] = "myemail@test.com";

const resendSendMock = vi
  .fn()
  .mockResolvedValue({ data: { id: "mock-email-id" }, error: null });

vi.mock("resend", () => {
  return {
    Resend: class {
      emails = { send: resendSendMock };
      constructor(apiKey: string) {
        if (apiKey !== process.env["RESEND_API_KEY"]) {
          throw new Error("Invalid API key");
        }

        this.emails = { send: resendSendMock };
      }
    },
  };
});

const createRequest = (body: unknown, csrf?: string) =>
  new NextRequest("http://localhost/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(csrf ? { "X-CSRF-Token": csrf } : {}),
    },
    body: JSON.stringify(body),
  });

const expectApiResponse = async (
  response: Response,
  expectedErrorStatus: number,
  expectedResultSuccess: boolean,
  expectedErrorRegex?: RegExp | string,
) => {
  expect(response.status).toBe(expectedErrorStatus);

  const result = ApiResponseSchema.parse(await response.json());
  expect(result.success).toBe(expectedResultSuccess);

  if (expectedErrorRegex) {
    expect(result.error).toMatch(expectedErrorRegex);
  }
};

const validContact = {
  honeypot: "",
  name: "John Doe",
  company_name: "Acme Corp",
  email: "test@example.com",
  message: "Test message with enough characters",
};

describe("POST /api/send-email", () => {
  it("rejects request without CSRF token", async () => {
    const request = createRequest(
      validContact,
      // Missing X-CSRF-Token header
    );

    const response = await POST(request);
    await expectApiResponse(response, 403, false, /CSRF/i);
  });

  it("rejects request with invalid CSRF token", async () => {
    const request = createRequest(validContact, "wrong-token");

    const response = await POST(request);
    await expectApiResponse(response, 403, false, /CSRF/i);
  });

  it("invalid payload returns 400", async () => {
    const request = createRequest(
      {
        // no email, message
      },
      process.env["CSRF_SECRET"],
    );

    const response = await POST(request);
    await expectApiResponse(response, 400, false, /invalid/i);
  });

  it("detects honeypot (bot) and returns fake success", async () => {
    const request = createRequest(
      {
        ...validContact,
        honeypot: "I am a bot",
      },
      process.env["CSRF_SECRET"],
    );

    const response = await POST(request);
    await expectApiResponse(response, 200, true);

    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it("sends email with valid data", async () => {
    const request = createRequest(validContact, process.env["CSRF_SECRET"]);

    const response = await POST(request);
    await expectApiResponse(response, 200, true);

    expect(resendSendMock).toHaveBeenCalled();
    const callArg = resendSendMock.mock.calls[0]?.[0] as {
      from: string;
      to: string;
      subject: string;
    };

    expect(typeof callArg.from).toBe("string");
    expect(callArg.to).toContain(process.env["TARGET_EMAIL"]);
    expect(callArg.subject).toContain("test@example.com");
  });
});

describe("Resend failures", () => {
  it("handles error if RESEND_API_KEY environment variable is not set", async () => {
    vi.resetModules();
    vi.stubEnv("RESEND_API_KEY", undefined);

    const { getResendInstance } = await import("app/api/send-email/route");
    await expect(getResendInstance()).rejects.toThrow(
      "RESEND_API_KEY is not set",
    );

    vi.unstubAllEnvs();
  });

  it("handles error if TARGET_EMAIL environment variable is not set", async () => {
    vi.resetModules();
    vi.stubEnv("TARGET_EMAIL", undefined);

    const { getTargetEmail } = await import("app/api/send-email/route");
    await expect(getTargetEmail()).rejects.toThrow("TARGET_EMAIL is not set");

    vi.unstubAllEnvs();
  });

  it("handles Resend API error when error IS an instance of Error", async () => {
    resendSendMock.mockResolvedValueOnce({
      data: null,
      error: new Error("Resend exploded"),
    });

    const request = createRequest(validContact, process.env["CSRF_SECRET"]);

    const response = await POST(request);
    await expectApiResponse(response, 500, false, /failed/i);

    expect(resendSendMock).toHaveBeenCalled();
  });

  it("handles Resend API error when error IS NOT an instance of Error", async () => {
    resendSendMock.mockResolvedValueOnce({
      data: null,
      error: { message: "API Error" },
    });

    const request = createRequest(validContact, process.env["CSRF_SECRET"]);

    const response = await POST(request);
    await expectApiResponse(response, 500, false, /failed/i);

    expect(resendSendMock).toHaveBeenCalled();
  });

  it("handles Error thrown values", async () => {
    resendSendMock.mockRejectedValueOnce(new Error("Network failure"));

    const request = createRequest(validContact, process.env["CSRF_SECRET"]);

    const response = await POST(request);
    await expectApiResponse(response, 500, false, /failed/i);

    expect(resendSendMock).toHaveBeenCalled();
  });

  it("handles non-Error thrown values", async () => {
    resendSendMock.mockRejectedValueOnce("Unexpected error");

    const request = createRequest(validContact, process.env["CSRF_SECRET"]);

    const response = await POST(request);
    await expectApiResponse(response, 500, false, /failed/i);

    expect(resendSendMock).toHaveBeenCalled();
  });
});
