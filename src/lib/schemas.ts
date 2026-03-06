import { type _Translator } from "next-intl";
import { z } from "zod";

type Messages = typeof import("../../messages/en.json");
type ContactMessages = Messages["Contact"];

/* ==================== CONTACT FORM ==================== */

export const ContactFormSchema = (t: _Translator<ContactMessages>) =>
  z.object({
    honeypot: z.string().optional(),
    name: z.string().trim().max(100, t("errors.nameMax")).optional(),
    company_name: z.string().trim().max(100, t("errors.companyMax")).optional(),
    email: z
      .string()
      .trim()
      .min(5, t("errors.emailMin"))
      .max(254, t("errors.emailMax"))
      .check(z.email(t("errors.emailInvalid")))
      .toLowerCase(),
    message: z
      .string()
      .trim()
      .min(10, t("errors.messageMin"))
      .max(5000, t("errors.messageMax")),
  });

export type ContactFormData = z.infer<ReturnType<typeof ContactFormSchema>>;

/* ==================== API RESPONSES ==================== */

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type ApiResponse = z.infer<typeof ApiResponseSchema>;

/* ==================== CSRF TOKEN ==================== */

export const CSRFResponseSchema = z.object({
  csrfToken: z.string().min(1).nullable(),
});

export type CSRFResponse = z.infer<typeof CSRFResponseSchema>;

/* ==================== HELPERS ==================== */

/**
 * Parse and validate JSON with Zod schema
 *
 * @throws Error if validation fails
 */
export async function parseJsonWithZod<T extends z.ZodType>(
  response: Response,
  schema: T,
): Promise<z.infer<T>> {
  if (!response.ok) {
    throw new Error(
      `HTTP Error: ${String(response.status)} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();

  const result = schema.safeParse(data);

  if (!result.success) {
    console.error("Zod validation errors:", z.treeifyError(result.error));
    throw new Error("Response validation failed");
  }

  return result.data;
}

/**
 * Format Zod errors for user-friendly display
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  error.issues.forEach((err) => {
    const path = err.path.join(".");
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(err.message);
  });

  return formatted;
}
