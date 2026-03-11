import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock, describe, expect, it, vi } from "vitest";

import type * as nextIntl from "next-intl";
import { toast } from "sonner";

import { ContactForm } from "components/ContactForm";
import * as csrfHook from "hooks/useCsrfToken";
import * as mountedHook from "hooks/useMounted";
import { getContactTranslator } from "utils/GetMessagesJson";

const tContact = await getContactTranslator();
const translations = {
  name: tContact("name"),
  company: tContact("company_name"),
  email: new RegExp(`^${tContact("email")}`, "i"),
  message: new RegExp(`^${tContact("message")}`, "i"),
  send: tContact("send"),
  honeypot: tContact("honeypot"),
  errors: {
    emailInvalid: tContact("errors.emailInvalid"),
    messageMin: tContact("errors.messageMin"),
  },
};

vi.mock("services/locale", () => ({
  getUserLocale: vi.fn().mockResolvedValue("en"),
}));

let mockTContact = tContact;
vi.mock("next-intl", async (importOriginal) => {
  const actual: typeof nextIntl = await importOriginal();
  return {
    ...actual,
    useTranslations: (namespace?: string) => {
      if (namespace === "Contact") return mockTContact;
      return (key: string) => key;
    },
  };
});

vi.mock("hooks/useMounted", () => ({
  useMounted: () => true,
}));

vi.mock("hooks/useCsrfToken", () => ({
  useCsrfToken: () => ({ csrfToken: "test-csrf-token" }),
}));

vi.mock("sonner", () => ({
  toast: vi.fn(),
}));

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(
    screen.getByLabelText(translations.email),
    "test@example.com",
  );
  await user.type(
    screen.getByLabelText(translations.message),
    "This is a test message with enough characters",
  );
};

describe("ContactForm", () => {
  it("renders all form fields", async () => {
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

  it("validates email format", async () => {
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

  it("validates message length", async () => {
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

  it("calls trigger with error fields when zodSchema reference changes", async () => {
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

    // New function reference → useMemo recomputes → new zodSchema → effect re-runs → trigger() called
    mockTContact = ((key: string) =>
      tContact(key as Parameters<typeof tContact>[0])) as typeof tContact;

    await waitFor(() => {
      expect(
        screen.getByText(translations.errors.emailInvalid),
      ).toBeInTheDocument();
      expect(
        screen.getByText(translations.errors.messageMin),
      ).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();

    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => Promise.resolve({ success: true, message: "Sent!" }),
    });

    render(<ContactForm />);

    await fillValidForm(user);

    const submitButton = screen.getByRole("button", {
      name: translations.send,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "api/send-email",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": "test-csrf-token",
          },
        }),
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

  it("shows loading state during submission", async () => {
    const user = userEvent.setup();

    (global.fetch as Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => Promise.resolve({ success: true }),
            });
          }, 100),
        ),
    );

    render(<ContactForm />);

    await fillValidForm(user);

    const submitButton = screen.getByRole("button", {
      name: translations.send,
    });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("honeypot field prevents bot submission", async () => {
    const user = userEvent.setup();

    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => Promise.resolve({ success: true }),
    });

    render(<ContactForm />);

    const honeypot = screen.getByLabelText(translations.honeypot);
    await user.type(honeypot, "I am a bot");

    await user.type(
      screen.getByLabelText(translations.email),
      "bot@example.com",
    );
    await user.type(screen.getByLabelText(translations.message), "Bot message");

    await user.click(screen.getByRole("button", { name: translations.send }));

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});

describe("ContactForm failures", () => {
  it("handles API error when error IS an instance of Error", async () => {
    const user = userEvent.setup();

    (global.fetch as Mock).mockRejectedValueOnce(new Error("Network error"));

    render(<ContactForm />);

    await fillValidForm(user);

    await user.click(screen.getByRole("button", { name: translations.send }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        "contact_form_error_title",
        expect.objectContaining({
          description: "contact_form_error_description",
        }),
      );
    });
  });

  it("handles error when parseJsonWithZod fails", async () => {
    const user = userEvent.setup();

    (global.fetch as Mock) = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => Promise.resolve({ invalid: "data" }),
    });

    render(<ContactForm />);

    await fillValidForm(user);

    await user.click(screen.getByRole("button", { name: translations.send }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        "contact_form_error_title",
        expect.objectContaining({
          description: "contact_form_error_description",
        }),
      );
    });
  });

  it("handles error when parseJsonWithZod is valid but result.success is false and error exists", async () => {
    const user = userEvent.setup();

    (global.fetch as Mock) = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () =>
        Promise.resolve({ success: false, error: "Server error" }),
    });

    render(<ContactForm />);

    await fillValidForm(user);

    await user.click(screen.getByRole("button", { name: translations.send }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        "contact_form_error_title",
        expect.objectContaining({
          description: "contact_form_error_description",
        }),
      );
    });
  });

  it("handles error when parseJsonWithZod is valid but result.success is false and error doesn't exist", async () => {
    const user = userEvent.setup();

    (global.fetch as Mock) = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => Promise.resolve({ success: false }),
    });

    render(<ContactForm />);

    await fillValidForm(user);

    await user.click(screen.getByRole("button", { name: translations.send }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        "contact_form_error_title",
        expect.objectContaining({
          description: "contact_form_error_description",
        }),
      );
    });
  });

  it("handles error if isMounted is false", () => {
    const spy = vi.spyOn(mountedHook, "useMounted").mockReturnValue(false);

    const { container } = render(<ContactForm />);
    expect(container.firstChild).toBeNull();

    spy.mockRestore();
  });

  it("handles error if sent CSRF token is null", async () => {
    const user = userEvent.setup();

    const spy = vi.spyOn(csrfHook, "useCsrfToken").mockReturnValue({
      ...csrfHook.useCsrfToken(),
      csrfToken: null,
    });

    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      json: async () =>
        Promise.resolve({ success: false, error: "Invalid CSRF token" }),
    });

    render(<ContactForm />);

    await fillValidForm(user);

    await user.click(screen.getByRole("button", { name: translations.send }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "api/send-email",
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": "",
          },
        }),
      );

      expect(toast).toHaveBeenCalledWith(
        "contact_form_error_title",
        expect.objectContaining({
          description: "contact_form_error_description",
        }),
      );
    });

    spy.mockRestore();
  });
});
