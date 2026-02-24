"use server";

import { type NextRequest, NextResponse } from "next/server";
import { ContactFormSchema, formatZodErrors } from "lib/schemas";

import { Resend } from "resend";

import { ContactEmailTemplate } from "components";

const resend = new Resend(process.env["RESEND_API_KEY"]);

interface ErrorResponse {
  error: string;
  details?: Record<string, unknown>;
}

const createErrorResponse = (
  message: string,
  status: number,
  details?: Record<string, unknown>,
): NextResponse<ErrorResponse> => {
  return NextResponse.json(
    {
      error: message,
      ...(details && { details }),
    },
    { status },
  );
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  const csrfToken = request.headers.get("x-csrf-token");
  if (!csrfToken || csrfToken !== process.env["CSRF_SECRET"]) {
    return createErrorResponse("Invalid CSRF token", 403);
  }

  const body: unknown = await request.json();
  const validation = ContactFormSchema.safeParse(body);

  if (!validation.success) {
    console.error("Validation errors:", formatZodErrors(validation.error));
    return createErrorResponse(
      "Invalid request data. Please check all required fields.",
      400,
      formatZodErrors(validation.error),
    );
  }

  const { honeypot, name, company_name, email, message } = validation.data;

  if (honeypot) {
    // Return success to avoid giving feedback to bots
    return NextResponse.json({ success: true });
  }

  if (!message || !email) {
    createErrorResponse("Missing required fields", 400);
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: "stevengodin78@gmail.com",
      subject: `New message from: ${email}`,
      react: ContactEmailTemplate({ name, company_name, email, message }),
    });

    if (error) {
      return createErrorResponse("Failed to send email", 500, { error });
    }

    return NextResponse.json(data);
  } catch (error) {
    return createErrorResponse("Failed to send email", 500, { error });
  }
}
