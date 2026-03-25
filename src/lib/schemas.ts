import { type _Translator } from "next-intl";
import { z } from "zod";

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

/* ==================== CUID ==================== */

export const CuidSchema = z
  .string()
  .regex(/^c[a-z0-9]{24,25}$/, "Invalid CUID format");

export type Cuid = z.infer<typeof CuidSchema>;

/* ==================== JWT SCHEMAS ==================== */

export const JWTPayloadSchema = z.object({
  sub: z.string(),
  email: z.email(),
  role: z.enum(["ADMIN"]),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export const RefreshPayloadSchema = z.object({
  sub: z.string(),
  email: z.email(),
  role: z.enum(["ADMIN"]),
  type: z.literal("refresh"),
  iat: z.number(),
  exp: z.number(),
});

/* ==================== CONTACT FORM ==================== */

type Messages = typeof import("../../messages/en.json");
type ContactMessages = Messages["Contact"];

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

/* ==================== EMAIL STATS ==================== */

export const EmailStatsSchema = z.object({
  summary: z.object({
    totalSent: z.number(),
    sent: z.number(),
    delivered: z.number(),
    bounced: z.number(),
    failed: z.number(),
    deliveryRate: z.string(),
  }),
  period: z.object({
    days: z.number(),
    startDate: z.string(),
    endDate: z.string(),
  }),
});

export type EmailStats = z.infer<typeof EmailStatsSchema>;

/* ==================== MESSAGE SCHEMAS ==================== */

export const MessageStatusEnum = z.enum(["NEW", "READ", "REPLIED", "ARCHIVED"]);

export const MessageListSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  subject: z.string(),
  content: z.string(),
  status: MessageStatusEnum,
  readAt: z.string().nullable(),
  createdAt: z.string(),
});

export const MessageDetailSchema = MessageListSchema.extend({
  repliedAt: z.string().nullable(),
  replyContent: z.string().nullable(),
  updatedAt: z.string(),
});

export const MessageStatsSchema = z.object({
  total: z.number(),
  unread: z.number(),
  replied: z.number(),
});

export const PaginationSchema = z.union([
  z.object({
    cursor: z.string(),
    limit: z.number(),
    hasNextPage: z.literal(true),
  }),
  z.object({
    limit: z.number(),
    hasNextPage: z.literal(false),
  }),
]);

export const MessagesResponseSchema = z.object({
  messages: z.array(MessageListSchema),
  pagination: PaginationSchema,
});

export const CreateMessageSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  subject: z.string().min(1),
  content: z.string().min(1),
});

export const UpdateMessageSchema = z.object({
  status: MessageStatusEnum.optional(),
  replyContent: z.string().optional(),
});

export const IdParamSchema = z.object({
  id: CuidSchema,
});

export type MessageStatus = z.infer<typeof MessageStatusEnum>;
export type MessageList = z.infer<typeof MessageListSchema>;
export type MessageDetail = z.infer<typeof MessageDetailSchema>;
export type MessageStats = z.infer<typeof MessageStatsSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type MessagesResponse = z.infer<typeof MessagesResponseSchema>;
export type CreateMessage = z.infer<typeof CreateMessageSchema>;
export type UpdateMessage = z.infer<typeof UpdateMessageSchema>;
export type IdParam = z.infer<typeof IdParamSchema>;

/* ==================== AUTH SCHEMAS ==================== */

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  role: z.enum(["ADMIN"]),
});

export const LoginCredentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const LoginRequestSchema = LoginCredentialsSchema;

export const LoginResponseSchema = z.object({
  user: UserSchema,
  message: z.string().optional(),
});

export const UserResponseSchema = z.object({
  user: UserSchema,
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

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
