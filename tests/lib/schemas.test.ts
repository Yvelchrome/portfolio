import { describe, expect, it } from "vitest";

import { z } from "zod";

import {
  ApiResponseSchema,
  CSRFResponseSchema,
  ContactFormSchema,
  formatZodErrors,
  parseJsonWithZod,
} from "lib/schemas";
import { getContactTranslator } from "utils/GetMessagesJson";

vi.mock("services/locale", () => ({
  getUserLocale: vi.fn().mockResolvedValue("en"),
}));

const tContact = await getContactTranslator();
const errors = {
  nameMax: tContact("errors.nameMax"),
  companyMax: tContact("errors.companyMax"),
  emailMin: tContact("errors.emailMin"),
  emailMax: tContact("errors.emailMax"),
  emailInvalid: tContact("errors.emailInvalid"),
  messageMin: tContact("errors.messageMin"),
  messageMax: tContact("errors.messageMax"),
};

const validContact = {
  email: "test@example.com",
  message: "Test message with enough characters",
};

const invalidContact = {
  email: "invalid-email",
  message: "short",
};

describe("validateWithZod", () => {
  it("lowercases email", () => {
    const result = ContactFormSchema(tContact).parse({
      email: "TEST@EXAMPLE.COM",
      message: validContact.message,
    });

    expect(result.email).toBe("test@example.com");
  });

  it("accepts valid data", () => {
    const result = ContactFormSchema(tContact).safeParse(validContact);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe(validContact.email);
      expect(result.data.message).toBe(validContact.message);
    }
  });

  it("requires email", () => {
    const invalidData = {
      message: validContact.message,
      // missing email
    };

    const result = ContactFormSchema(tContact).safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("email");
    }
  });

  it("requires message", () => {
    const invalidData = {
      email: validContact.email,
      // missing message
    };

    const result = ContactFormSchema(tContact).safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("message");
    }
  });

  it("validates email format", () => {
    const result = ContactFormSchema(tContact).safeParse({
      ...validContact,
      email: invalidContact.email,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((i) =>
        i.path.includes("email"),
      );

      expect(emailError?.message).toBe(errors.emailInvalid);
    }
  });

  it("validates email length (min)", () => {
    const result = ContactFormSchema(tContact).safeParse({
      ...validContact,
      email: "a",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((i) =>
        i.path.includes("email"),
      );

      expect(emailError?.message).toBe(errors.emailMin);
    }
  });

  it("validates email length (max)", () => {
    const result = ContactFormSchema(tContact).safeParse({
      ...validContact,
      email: "a".repeat(256),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((i) =>
        i.path.includes("email"),
      );

      expect(emailError?.message).toBe(errors.emailMax);
    }
  });

  it("validates message length (min)", () => {
    const result = ContactFormSchema(tContact).safeParse({
      ...validContact,
      message: invalidContact.message,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const messageError = result.error.issues.find((i) =>
        i.path.includes("message"),
      );
      expect(messageError?.message).toBe(errors.messageMin);
    }
  });

  it("validates message length (max)", () => {
    const result = ContactFormSchema(tContact).safeParse({
      ...validContact,
      message: "a".repeat(5001),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const messageError = result.error.issues.find((i) =>
        i.path.includes("message"),
      );
      expect(messageError?.message).toBe(errors.messageMax);
    }
  });

  it("validates name length (max)", () => {
    const result = ContactFormSchema(tContact).safeParse({
      ...validContact,
      name: "a".repeat(101),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find((i) =>
        i.path.includes("name"),
      );
      expect(nameError?.message).toBe(errors.nameMax);
    }
  });

  it("validates company name length (max)", () => {
    const result = ContactFormSchema(tContact).safeParse({
      ...validContact,
      company_name: "a".repeat(101),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const companyNameError = result.error.issues.find((i) =>
        i.path.includes("company_name"),
      );
      expect(companyNameError?.message).toBe(errors.companyMax);
    }
  });

  it("allows optional fields to be omitted", () => {
    const result = ContactFormSchema(tContact).safeParse({
      ...validContact,
      // no name, company_name, honeypot
    });

    expect(result.success).toBe(true);
  });

  it("detects honeypot (bot)", () => {
    const botData = {
      honeypot: "I am a bot",
      email: "bot@example.com",
      message: "Bot message",
    };

    const result = ContactFormSchema(tContact).safeParse(botData);

    expect(result.success).toBe(true);
  });
});

describe("ApiResponseSchema", () => {
  it("validates success response", () => {
    const result = ApiResponseSchema.safeParse({
      success: true,
      message: "Operation successful",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.success).toBe(true);
    }
  });

  it("validates error response", () => {
    const result = ApiResponseSchema.safeParse({
      success: false,
      error: "Something went wrong",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.success).toBe(false);
      expect(result.data.error).toBeDefined();
    }
  });

  it("allows optional fields to be omitted", () => {
    const result = ApiResponseSchema.safeParse({
      success: true,
      // no message, error
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.success).toBe(true);
      expect(result.data.message).toBeUndefined();
      expect(result.data.error).toBeUndefined();
    }
  });
});

describe("CSRFResponseSchema", () => {
  it("validates valid CSRF token", () => {
    const result = CSRFResponseSchema.safeParse({
      csrfToken: "valid-token-123",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.csrfToken).toBe("valid-token-123");
    }
  });

  it("rejects empty token", () => {
    const result = CSRFResponseSchema.safeParse({
      csrfToken: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const tokenError = result.error.issues.find((i) =>
        i.path.includes("csrfToken"),
      );
      expect(tokenError?.message).toMatch(/too small/i);
    }
  });

  it("requires csrfToken field", () => {
    const result = CSRFResponseSchema.safeParse({});

    expect(result.success).toBe(false);
    if (!result.success) {
      const tokenError = result.error.issues.find((i) =>
        i.path.includes("csrfToken"),
      );
      expect(tokenError).toBeDefined();
    }
  });
});

describe("parseJsonWithZod", () => {
  it("parses and validates valid JSON", async () => {
    const mockResponse = {
      ok: true,
      json: async () => Promise.resolve({ success: true, message: "OK" }),
    } as Response;

    const result = await parseJsonWithZod(mockResponse, ApiResponseSchema);

    expect(result.success).toBe(true);
    expect(result.message).toBe("OK");
  });

  it("throws on HTTP error", async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      statusText: "Bad Request",
    } as Response;

    await expect(
      parseJsonWithZod(mockResponse, ApiResponseSchema),
    ).rejects.toThrow(/HTTP Error: 400/);
  });

  it("throws on validation error", async () => {
    const mockResponse = {
      ok: true,
      json: async () => Promise.resolve({ invalid: "data" }),
    } as Response;

    await expect(
      parseJsonWithZod(mockResponse, ApiResponseSchema),
    ).rejects.toThrow("Response validation failed");
  });
});

describe("formatZodErrors", () => {
  it("formats validation errors", () => {
    const result = ContactFormSchema(tContact).safeParse({
      ...invalidContact,
      email: "a",
    });

    if (!result.success) {
      const formatted = formatZodErrors(result.error);

      expect(formatted).toHaveProperty("email");
      expect(formatted).toHaveProperty("message");

      expect(typeof formatted["email"]).toBe("object");
      expect(typeof formatted["message"]).toBe("object");

      expect(formatted["email"]?.length).toBe(2);
    }
  });

  it("handles nested errors", () => {
    const NestedSchema = z.object({
      user: z.object({
        name: z.string().min(2),
        email: z.email(),
      }),
    });

    const result = NestedSchema.safeParse({
      user: {
        name: "a",
        email: "invalid",
      },
    });

    if (!result.success) {
      const formatted = formatZodErrors(result.error);

      expect(formatted).toHaveProperty("user.name");
      expect(formatted).toHaveProperty("user.email");
    }
  });
});
