import { beforeEach, describe, expect, it, vi } from "vitest";

import { type SendEmailState, sendEmail } from "app/actions/send-email";
import { prisma } from "lib/prisma/prisma";

process.env["RESEND_API_KEY"] = "test-resend-key";
process.env["TARGET_EMAIL"] = "myemail@test.com";
process.env["DATABASE_URL"] = "file:./test.db";

vi.mock("services/locale", () => ({
  getUserLocale: vi.fn().mockResolvedValue("en"),
}));

vi.mock("lib/prisma/prisma", () => ({
  prisma: {
    message: {
      create: vi.fn().mockResolvedValue({ id: "mock-message-id" }),
    },
  },
}));

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

vi.mock("utils/GetMessagesJson", () => ({
  getContactTranslator: vi.fn().mockResolvedValue((key: string) => key),
}));

vi.mock("emails/ContactEmailTemplate", () => ({
  __esModule: true,
  default: vi.fn(
    ({
      name,
      company_name,
      email,
      message,
    }: {
      name: string;
      company_name: string;
      email: string;
      message: string;
    }) => ({
      type: "div",
      props: { name, company_name, email, message },
    }),
  ),
}));

const createFormData = (overrides: Record<string, string> = {}) => {
  const formData = new FormData();
  Object.entries({
    honeypot: "",
    name: "",
    company_name: "",
    email: "",
    message: "",
    ...overrides,
  }).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });
  return formData;
};

const validFormData = createFormData({
  name: "John Doe",
  company_name: "Acme Corp",
  email: "test@example.com",
  message: "This is a valid test message with enough characters.",
});
const minimalFormData = createFormData({
  email: "test@example.com",
  message: "This is a valid test message with enough characters.",
});
const invalidFormData = createFormData({
  email: "invalid-email",
  message: "Short",
});
const missingFieldsFormData = createFormData({ honeypot: "" });

const assertSuccess = (result: SendEmailState) => {
  expect(result.success).toBe(true);
};
const assertFieldError = (result: SendEmailState, field: string) => {
  expect(result.errors?.[field]).toBeDefined();
};
const assertError = (result: SendEmailState) => {
  expect(result.success).toBeUndefined();
  expect(result.error).toBe("Failed to send email");
};

interface MockSetup {
  callFn: () => Promise<SendEmailState>;
  expectCall: boolean;
}

describe("sendEmail Server Action", () => {
  beforeEach(() => {
    resendSendMock.mockResolvedValue({
      data: { id: "mock-email-id" },
      error: null,
    });
  });

  describe("Successful submissions", () => {
    it("valid submission returns success", async () => {
      assertSuccess(await sendEmail({} as SendEmailState, validFormData));
    });
    it("minimal fields return success", async () => {
      assertSuccess(await sendEmail({} as SendEmailState, minimalFormData));
    });
    it("honeypot filled returns success without sending", async () => {
      const result = await sendEmail(
        {} as SendEmailState,
        createFormData({
          honeypot: "I am a bot",
          name: "Bot",
          email: "bot@example.com",
          message: "Bot message here with enough characters",
        }),
      );
      assertSuccess(result);
      expect(resendSendMock).not.toHaveBeenCalled();
    });

    it("saves message to database", async () => {
      await sendEmail({} as SendEmailState, validFormData);
      const mockCreate = vi.mocked(prisma.message["create"]);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          name: "John Doe",
          email: "test@example.com",
          subject: "New message from: test@example.com",
          content:
            "Company: Acme Corp\n\nThis is a valid test message with enough characters.",
          status: "NEW",
        },
      });
    });

    it("saves minimal message as Anonymous", async () => {
      await sendEmail({} as SendEmailState, minimalFormData);
      const mockCreate = vi.mocked(prisma.message["create"]);
      expect(mockCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "Anonymous",
          email: "test@example.com",
        }) as unknown as Parameters<typeof prisma.message.create>[0]["data"],
      });
    });

    it("uses company_name when name is empty (name || company_name priority)", async () => {
      await sendEmail(
        {} as SendEmailState,
        createFormData({
          name: "",
          company_name: "Acme Corp",
          email: "test@example.com",
          message: "This is a valid test message with enough characters.",
        }),
      );
      const mockCreate = vi.mocked(prisma.message["create"]);
      expect(mockCreate).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "Acme Corp",
          email: "test@example.com",
        }) as unknown as Parameters<typeof prisma.message.create>[0]["data"],
      });
    });

    it("sends email via Resend with correct template props", async () => {
      await sendEmail({} as SendEmailState, validFormData);
      expect(resendSendMock).toHaveBeenCalledWith({
        from: "Portfolio Contact Form <onboarding@resend.dev>",
        to: "myemail@test.com",
        subject: "New message from: test@example.com",
        react: {
          type: "div",
          props: {
            name: "John Doe",
            company_name: "Acme Corp",
            email: "test@example.com",
            message: "This is a valid test message with enough characters.",
          },
        },
      });
    });
  });

  describe("Validation errors", () => {
    it.each`
      formData                 | field
      ${missingFieldsFormData} | ${"email"}
      ${missingFieldsFormData} | ${"message"}
      ${invalidFormData}       | ${"email"}
      ${invalidFormData}       | ${"message"}
    `(
      "returns error for $field",
      async ({ formData, field }: { formData: FormData; field: string }) => {
        const result = await sendEmail({} as SendEmailState, formData);
        assertFieldError(result, field);
      },
    );

    it("returns multiple field errors", async () => {
      const result = await sendEmail({} as SendEmailState, invalidFormData);
      expect(result.errors?.["email"]).toBeDefined();
      expect(result.errors?.["message"]).toBeDefined();
    });

    it.each`
      scenario        | mockSetup
      ${"validation"} | ${{ callFn: () => sendEmail({} as SendEmailState, invalidFormData), expectCall: false }}
      ${"database error"} | ${{
  callFn: async () => {
    const mockCreate = vi.mocked(prisma.message["create"]);
    mockCreate.mockRejectedValueOnce(new Error("DB fail"));
    return sendEmail({} as SendEmailState, validFormData);
  },
  expectCall: false,
}}
    `(
      "does not send email on $scenario failure",
      async ({ mockSetup }: { mockSetup: MockSetup }) => {
        await mockSetup.callFn();
        expect(resendSendMock).not.toHaveBeenCalled();
      },
    );
  });

  describe("Database errors", () => {
    it("returns error when Prisma fails", async () => {
      const mockCreate = vi.mocked(prisma.message["create"]);
      mockCreate.mockRejectedValueOnce(new Error("Database connection failed"));
      assertError(await sendEmail({} as SendEmailState, validFormData));
    });

    it("succeeds without database when DATABASE_URL is not set", async () => {
      vi.stubEnv("DATABASE_URL", "");

      const result = await sendEmail({}, validFormData);

      expect(result.success).toBe(true);

      const mockCreate = vi.mocked(prisma.message["create"]);

      expect(mockCreate).not.toHaveBeenCalled();
      expect(resendSendMock).toHaveBeenCalled();

      vi.unstubAllEnvs();
    });
  });

  describe("Resend email errors", () => {
    it.each`
      scenario                 | mockValue
      ${"error object"}        | ${{ data: null, error: { message: "API rate limit" } }}
      ${"Error instance"}      | ${{ data: null, error: new Error("Invalid API key") }}
      ${"rejected promise"}    | ${{ throw: new Error("Network failure") }}
      ${"non-Error rejection"} | ${{ throw: "Unexpected string error" }}
    `(
      "returns error when Resend fails ($scenario)",
      async ({
        mockValue,
      }: {
        mockValue: { data?: unknown; error?: unknown; throw?: unknown };
      }) => {
        if (mockValue.throw)
          vi.mocked(resendSendMock).mockRejectedValueOnce(mockValue.throw);
        else vi.mocked(resendSendMock).mockResolvedValueOnce(mockValue);
        assertError(await sendEmail({} as SendEmailState, validFormData));
      },
    );
  });

  describe("Environment validation", () => {
    it.each`
      envVar              | stubFn
      ${"RESEND_API_KEY"} | ${() => vi.stubEnv("RESEND_API_KEY", undefined)}
      ${"TARGET_EMAIL"}   | ${() => vi.stubEnv("TARGET_EMAIL", undefined)}
    `(
      "returns error when $envVar not set",
      async ({ stubFn }: { stubFn: () => void }) => {
        vi.resetModules();
        stubFn();
        const { sendEmail: reimported } =
          await import("app/actions/send-email");
        assertError(await reimported({} as SendEmailState, validFormData));
        vi.unstubAllEnvs();
      },
    );
  });
});
