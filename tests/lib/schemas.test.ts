import { describe, expect, it, vi } from "vitest";

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

  describe.each`
    field        | value                     | expectedError
    ${"email"}   | ${invalidContact.email}   | ${errors.emailInvalid}
    ${"email"}   | ${"a"}                    | ${errors.emailMin}
    ${"email"}   | ${"a".repeat(256)}        | ${errors.emailMax}
    ${"message"} | ${invalidContact.message} | ${errors.messageMin}
    ${"message"} | ${"a".repeat(5001)}       | ${errors.messageMax}
    ${"name"}    | ${"a".repeat(101)}        | ${errors.nameMax}
  `(
    "validates $field length",
    ({
      field,
      value,
      expectedError,
    }: {
      field: string;
      value: string;
      expectedError: string;
    }) => {
      it(`shows error for invalid ${field}`, () => {
        const result = ContactFormSchema(tContact).safeParse({
          ...validContact,
          [field]: value,
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          const fieldError = result.error.issues.find((i) =>
            i.path.includes(field),
          );
          expect(fieldError?.message).toBe(expectedError);
        }
      });
    },
  );

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
  it.each`
    data                                | successField | hasExtra
    ${{ success: true, message: "OK" }} | ${true}      | ${"message"}
    ${{ success: false, error: "Err" }} | ${false}     | ${"error"}
    ${{ success: true }}                | ${true}      | ${"none"}
  `("validates response with $hasExtra fields", ({ data, successField }) => {
    const result = ApiResponseSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.success).toBe(successField);
    }
  });
});

describe("CSRFResponseSchema", () => {
  it.each`
    csrfToken            | valid    | description
    ${"valid-token-123"} | ${true}  | ${"valid token"}
    ${""}                | ${false} | ${"empty token"}
    ${undefined}         | ${false} | ${"missing token"}
  `(
    "validates $description",
    ({
      csrfToken,
      valid,
    }: {
      csrfToken: string | undefined;
      valid: boolean;
      description: string;
    }) => {
      const result = CSRFResponseSchema.safeParse({ csrfToken });

      if (valid) {
        expect(result.success).toBe(true);
        if (result.data) {
          expect(result.data.csrfToken).toBe(csrfToken);
        }
      } else {
        expect(result.success).toBe(false);

        if (!result.success) {
          const tokenError = result.error.issues.find((i) =>
            i.path.includes("csrfToken"),
          );
          expect(tokenError).toBeDefined();
        }
      }
    },
  );
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
