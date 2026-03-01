import { describe, it, expect, vi, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { ContactForm } from "components/ContactForm";
import * as mountedHook from "lib/hooks/useMounted";
import * as csrfHook from "lib/hooks/useCsrfToken";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("lib/hooks/useMounted", () => ({
  useMounted: () => true,
}));

vi.mock("lib/hooks/useCsrfToken", () => ({
  useCsrfToken: () => ({ csrfToken: "test-csrf-token" }),
}));

vi.mock("sonner", () => ({
  toast: vi.fn(),
}));

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/email/i), "test@example.com");
  await user.type(
    screen.getByLabelText(/message/i),
    "This is a test message with enough characters",
  );
};

describe("ContactForm", () => {
  it("renders all form fields", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("validates email format", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /send/i });

    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(emailInput).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it("validates message length", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole("button", { name: /send/i });

    await user.type(messageInput, "Short");
    await user.click(submitButton);

    await waitFor(() => {
      expect(messageInput).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument();
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

    const submitButton = screen.getByRole("button", { name: /send/i });
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

      expect(screen.getByLabelText(/email/i)).toHaveValue("");
      expect(screen.getByLabelText(/message/i)).toHaveValue("");
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

    const submitButton = screen.getByRole("button", { name: /send/i });
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

    const honeypot = screen.getByLabelText(/honeypot/i);
    await user.type(honeypot, "I am a bot");

    await user.type(screen.getByLabelText(/email/i), "bot@example.com");
    await user.type(screen.getByLabelText(/message/i), "Bot message");

    await user.click(screen.getByRole("button", { name: /send/i }));

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

    await user.click(screen.getByRole("button", { name: /send/i }));

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

    await user.click(screen.getByRole("button", { name: /send/i }));

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

    await user.click(screen.getByRole("button", { name: /send/i }));

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

    await user.click(screen.getByRole("button", { name: /send/i }));

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

    await user.click(screen.getByRole("button", { name: /send/i }));

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
