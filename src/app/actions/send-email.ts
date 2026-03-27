"use server";

import { Resend } from "resend";

import ContactEmailTemplate from "emails/ContactEmailTemplate";
import { ContactFormSchema, formatZodErrors } from "lib/schemas";
import { getContactTranslator } from "utils/GetMessagesJson";

export type SendEmailState = {
  success?: boolean | undefined;
  error?: string | undefined;
  errors?: Record<string, string[]> | undefined;
};

let resend: Resend | undefined;
async function getResendInstance(): Promise<Resend> {
  "server-only";

  if (!resend) {
    const key = process.env["RESEND_API_KEY"];
    if (!key) throw new Error("RESEND_API_KEY not set");
    resend = new Resend(key);
  }

  await Promise.resolve();
  return resend;
}

let targetEmail: string | undefined;
async function getTargetEmail(): Promise<string> {
  "server-only";

  if (!targetEmail) {
    const email = process.env["TARGET_EMAIL"];
    if (!email) throw new Error("TARGET_EMAIL not set");
    targetEmail = email;
  }

  await Promise.resolve();
  return targetEmail;
}

export async function sendEmail(
  _prevState: SendEmailState,
  formData: FormData,
): Promise<SendEmailState> {
  "use server";

  const rawFormData = Object.fromEntries(formData);
  const tContact = await getContactTranslator();
  const prisma = process.env["DATABASE_URL"]
    ? (await import("lib/prisma/prisma")).prisma
    : undefined;

  const validation = ContactFormSchema(tContact).safeParse(rawFormData);

  if (!validation.success) {
    return {
      errors: formatZodErrors(validation.error),
    };
  }

  const { honeypot, name, company_name, email, message } = validation.data;

  // Honeypot check for basic bot protection
  if (honeypot) {
    return { success: true };
  }

  try {
    if (prisma) {
      await prisma.message.create({
        data: {
          name: name || company_name || "Anonymous",
          email,
          subject: `New message from: ${email}`,
          content: company_name
            ? `Company: ${company_name}\n\n${message}`
            : message,
          status: "NEW",
        },
      });
    }

    const resendInstance = await getResendInstance();
    const targetEmail = await getTargetEmail();

    const { error } = await resendInstance.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: targetEmail,
      subject: `New message from: ${email}`,
      react: ContactEmailTemplate({
        name: name || "",
        company_name: company_name || "",
        email,
        message,
      }),
    });

    if (error) {
      console.error("Resend API error:", error);
      return { error: "Failed to send email" };
    }

    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { error: "Failed to send email" };
  }
}
