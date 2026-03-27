import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type * as nextIntl from "next-intl";
import { toast } from "sonner";

import { sendEmail } from "app/actions/send-email";
import { ContactForm } from "components/ContactForm";
import * as mountedHook from "hooks/useMounted";
import { getContactTranslator } from "utils/GetMessagesJson";

const tContact = await getContactTranslator();
const translations = {
  name: tContact("name"),
  form_field_name: tContact("form_field_name"),

  email: new RegExp(`^${tContact("email")}`),
  form_field_email: tContact("form_field_email"),

  company: tContact("company_name"),
  form_field_company_name: tContact("form_field_company_name"),

  message: new RegExp(`^${tContact("message")}`),
  form_field_message: tContact("form_field_message"),

  send: tContact("send"),
  send_pending: tContact("send_pending"),

  honeypot: tContact("honeypot"),
  errors: {
    nameMax: tContact("errors.nameMax"),
    companyMax: tContact("errors.companyMax"),
    emailMin: tContact("errors.emailMin"),
    emailMax: tContact("errors.emailMax"),
    emailInvalid: tContact("errors.emailInvalid"),
    messageMin: tContact("errors.messageMin"),
    messageMax: tContact("errors.messageMax"),
  },
};

vi.mock("services/locale", () => ({
  getUserLocale: vi.fn().mockResolvedValue("en"),
}));

// Track schema changes for triggering useMemo dependency updates
let zodSchemaVersion = 0;
vi.mock("next-intl", async (importOriginal) => {
  const actual: typeof nextIntl = await importOriginal();
  return {
    ...actual,
    useTranslations: (namespace?: string) => {
      if (namespace === "Contact") {
        // Return function that changes reference each call to trigger schema update
        return (key: string) => {
          const value = tContact(key as Parameters<typeof tContact>[0]);
          // Add suffix based on version to change function reference
          return zodSchemaVersion > 0
            ? `${value} v${String(zodSchemaVersion)}`
            : value;
        };
      }
      return (key: string) => key;
    },
  };
});

vi.mock("hooks/useMounted", () => ({
  useMounted: () => true,
}));

vi.mock("sonner", () => ({
  toast: vi.fn(),
}));

vi.mock("app/actions/send-email", () => ({
  sendEmail: vi.fn(),
}));
const mockSendEmail = vi.mocked(sendEmail);

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  const emailInput = screen.getByLabelText(translations.email);
  const messageInput = screen.getByLabelText(translations.message);

  await user.type(emailInput, "test@example.com");
  await user.type(
    messageInput,
    "This is a test message with enough characters.",
  );
};

describe("ContactForm Component", () => {
  describe("Rendering", () => {
    it("renders all form fields correctly", async () => {
      render(<ContactForm />);

      await waitFor(() => {
        expect(screen.getByLabelText(translations.name)).toBeInTheDocument();
        expect(screen.getByLabelText(translations.company)).toBeInTheDocument();
        expect(screen.getByLabelText(translations.email)).toBeInTheDocument();
        expect(screen.getByLabelText(translations.message)).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: translations.send }),
        ).toBeInTheDocument();
      });
    });

    it("renders with correct field attributes", async () => {
      render(<ContactForm />);

      await waitFor(() => {
        const emailInput = screen.getByLabelText(translations.email);
        const messageInput = screen.getByLabelText(translations.message);

        expect(emailInput).toHaveAttribute("type", "email");
        expect(emailInput).toHaveAttribute("autocomplete", "email");
        expect(messageInput).toHaveAttribute("maxlength", "5000");
      });
    });

    it("returns null and renders nothing when not mounted", () => {
      const spy = vi.spyOn(mountedHook, "useMounted").mockReturnValue(false);

      const { container } = render(<ContactForm />);
      expect(container.firstChild).toBeNull();

      spy.mockRestore();
    });
  });

  describe("Client-side validation", () => {
    it("shows validation error for invalid email format", async () => {
      mockSendEmail.mockResolvedValue({ success: false });
      const user = userEvent.setup();

      render(<ContactForm />);

      const emailInput = screen.getByLabelText(translations.email);
      const submitButton = screen.getByRole("button", {
        name: translations.send,
      });

      await user.type(emailInput, "invalid-email");
      await user.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toHaveAttribute("aria-invalid", "true");
        expect(
          screen.getByText(translations.errors.emailInvalid),
        ).toBeInTheDocument();
      });
    });

    it("shows validation error for message too short", async () => {
      mockSendEmail.mockResolvedValue({ success: false });
      const user = userEvent.setup();

      render(<ContactForm />);

      const messageInput = screen.getByLabelText(translations.message);
      const submitButton = screen.getByRole("button", {
        name: translations.send,
      });

      await user.type(messageInput, "Short");
      await user.click(submitButton);

      await waitFor(() => {
        expect(messageInput).toHaveAttribute("aria-invalid", "true");
        expect(
          screen.getByText(translations.errors.messageMin),
        ).toBeInTheDocument();
      });
    });

    it("validates on blur by default", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const emailInput = screen.getByLabelText(translations.email);

      await user.type(emailInput, "invalid-email");
      await user.tab();

      await waitFor(() => {
        expect(emailInput).toHaveAttribute("aria-invalid", "true");
      });
    });
  });

  describe("Form submission", () => {
    it("calls server action with form data on submission", async () => {
      mockSendEmail.mockResolvedValue({ success: true });
      const user = userEvent.setup();

      render(<ContactForm />);

      await fillValidForm(user);

      const submitButton = screen.getByRole("button", {
        name: translations.send,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSendEmail).toHaveBeenCalled();

        const formData = mockSendEmail.mock.calls[0]?.[1] as FormData;
        const rawFormData = Object.fromEntries(formData);

        expect(rawFormData["email"]).toBe("test@example.com");
        expect(rawFormData["message"]).toBe(
          "This is a test message with enough characters.",
        );

        expect(toast).toHaveBeenCalledWith(
          "contact_form_success_title",
          expect.objectContaining({
            description: "contact_form_success_description",
          }),
        );

        expect(screen.getByLabelText(translations.email)).toHaveValue("");
        expect(screen.getByLabelText(translations.message)).toHaveValue("");
      });
    });
  });

  describe("Toast notifications", () => {
    it("shows error toast when submission returns error state", async () => {
      mockSendEmail.mockResolvedValueOnce({
        success: false,
        error: "Failed to send email",
      });
      const user = userEvent.setup();

      render(<ContactForm />);

      const emailInput = screen.getByLabelText(translations.email);
      const messageInput = screen.getByLabelText(translations.message);
      const submitButton = screen.getByRole("button", {
        name: translations.send,
      });

      await user.type(emailInput, "invalid-email");
      await user.type(messageInput, "Short");
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith(
          "contact_form_error_title",
          expect.objectContaining({
            description: "contact_form_error_description",
          }),
        );
      });
    });
  });

  describe("Pending state", () => {
    it("disables button while submission is pending", async () => {
      mockSendEmail.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => {
              resolve({ success: true });
            }, 100),
          ),
      );

      const user = userEvent.setup();
      render(<ContactForm />);

      await fillValidForm(user);

      const submitButton = screen.getByRole("button", {
        name: translations.send,
      });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveAttribute("aria-busy", "true");

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).toHaveAttribute("aria-busy", "false");
      });
    });

    it("shows pending text while submission is in progress", async () => {
      mockSendEmail.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => {
              resolve({ success: true });
            }, 100),
          ),
      );
      const user = userEvent.setup();

      render(<ContactForm />);

      await fillValidForm(user);

      const submitButton = screen.getByRole("button", {
        name: translations.send,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: translations.send_pending }),
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: translations.send }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Honeypot handling", () => {
    it("does not call server action when honeypot is filled", async () => {
      const user = userEvent.setup();

      render(<ContactForm />);

      const honeypot = screen.getByLabelText(translations.honeypot);
      await user.type(honeypot, "I am a bot");

      await fillValidForm(user);

      const submitButton = screen.getByRole("button", {
        name: translations.send,
      });
      await user.click(submitButton);

      expect(mockSendEmail).not.toHaveBeenCalled();
    });
  });

  describe("Schema change re-validation", () => {
    it("re-validates fields when schema changes and errors exist", async () => {
      const user = userEvent.setup();

      render(<ContactForm />);

      const emailInput = screen.getByLabelText(translations.email);
      const messageInput = screen.getByLabelText(translations.message);
      const submitButton = screen.getByRole("button", {
        name: translations.send,
      });

      // First, trigger validation to populate errors
      await user.type(emailInput, "invalid-email");
      await user.type(messageInput, "Short");
      await user.click(submitButton);

      // Wait for errors to appear
      await waitFor(() => {
        expect(emailInput).toHaveAttribute("aria-invalid", "true");
        expect(messageInput).toHaveAttribute("aria-invalid", "true");
      });

      // Trigger schema change by incrementing version counter
      // This makes the useTranslations hook return a new function reference
      zodSchemaVersion++;

      await waitFor(() => {
        expect(
          screen.getByText(translations.errors.emailInvalid),
        ).toBeInTheDocument();
        expect(
          screen.getByText(translations.errors.messageMin),
        ).toBeInTheDocument();
      });

      zodSchemaVersion = 0;
    });
  });

  describe("Field-level errors from server", () => {
    it("accepts field-level errors returned from server action", async () => {
      mockSendEmail.mockResolvedValueOnce({
        success: false,
        errors: {
          email: ["Server-side email error"],
          message: ["Server-side message error"],
        },
      });
      const user = userEvent.setup();

      render(<ContactForm />);

      await fillValidForm(user);

      const submitButton = screen.getByRole("button", {
        name: translations.send,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSendEmail).toHaveBeenCalled();
      });
    });
  });
});

describe("ContactForm edge cases", () => {
  it("handles form submission with only required fields filled", async () => {
    mockSendEmail.mockResolvedValue({ success: true });
    const user = userEvent.setup();

    render(<ContactForm />);

    await fillValidForm(user);

    const submitButton = screen.getByRole("button", {
      name: translations.send,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSendEmail).toHaveBeenCalled();
    });
  });

  it("handles optional name and company fields", async () => {
    const user = userEvent.setup();

    render(<ContactForm />);

    const nameInput = screen.getByLabelText(translations.name);
    const companyInput = screen.getByLabelText(translations.company);

    await user.type(nameInput, "John Doe");
    await user.type(companyInput, "Acme Corporation");
    await fillValidForm(user);

    const submitButton = screen.getByRole("button", {
      name: translations.send,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSendEmail).toHaveBeenCalled();

      const formData = mockSendEmail.mock.calls[0]?.[1] as FormData;
      const rawFormData = Object.fromEntries(formData);

      expect(rawFormData["name"]).toBe("John Doe");
      expect(rawFormData["company_name"]).toBe("Acme Corporation");
      expect(rawFormData["email"]).toBe("test@example.com");
      expect(rawFormData["message"]).toBe(
        "This is a test message with enough characters.",
      );
    });
  });
});
