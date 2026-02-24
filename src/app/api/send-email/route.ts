"use server";

import { type NextRequest, NextResponse } from "next/server";
import { ContactFormSchema, formatZodErrors } from "lib/schemas";

import { Resend } from "resend";

import { ContactEmailTemplate } from "components";

const resend = new Resend(process.env["RESEND_API_KEY"]);

interface ErrorResponse {
  success: false;
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
      success: false,
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
    console.warn("Bot detected via honeypot");
    return NextResponse.json({ success: true }, { status: 200 });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: "stevengodin78@gmail.com",
      subject: `New message from: ${email}`,
      react: ContactEmailTemplate({ name, company_name, email, message }),
    });

    if (error) {
      console.error("Resend API error:", error);

      const errorDetails =
        error instanceof Error
          ? { message: error.message, name: error.name }
          : { error };

      return createErrorResponse("Failed to send email.", 500, errorDetails);
    }

    console.info("Email sent", { data, email });
    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully!",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Unexpected error:", error);

    const errorDetails =
      error instanceof Error
        ? { message: error.message, name: error.name }
        : { error };

    return createErrorResponse("Failed to send email.", 500, errorDetails);
  }
}
