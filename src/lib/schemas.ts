import { z } from "zod";

/* ==================== CONTACT FORM ==================== */

export const ContactFormSchema = z.object({
  honeypot: z.string().optional(),
  name: z
    .string()
    .trim()
    .max(100, "Name must be 100 characters or less")
    .optional(),
  company_name: z
    .string()
    .trim()
    .max(100, "Company name must be 100 characters or less")
    .optional(),
  email: z
    .string()
    .trim()
    .min(5, "Email must be at least 5 characters")
    .max(254, "Email must be 254 characters or less")
    .check(z.email("Please enter a valid email address"))
    .toLowerCase(),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be 5000 characters or less"),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

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
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};

  error.issues.forEach((err) => {
    const path = err.path.join(".");
    formatted[path] = err.message;
  });

  return formatted;
}
