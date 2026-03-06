import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ContactEmailTemplate from "emails/ContactEmailTemplate";

describe("ContactEmailTemplate renders logo correctly", () => {
  it("renders the template with all the properties", () => {
    render(
      <ContactEmailTemplate
        name="John Doe"
        company_name="Acme Corp"
        email="test.example.com"
        message="Test message with enough characters"
      />,
    );
  });

  it("renders the logo with the correct production URL", async () => {
    vi.stubEnv("NODE_ENV", "not-development");

    render(
      <ContactEmailTemplate email="test@example.com" message="Test message" />,
    );

    await waitFor(() => {
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "https://svgd.vercel.app/logo.png");
    });

    vi.unstubAllEnvs();
  });

  it("renders the logo with localhost URL in development", async () => {
    vi.stubEnv("NODE_ENV", "development");

    render(
      <ContactEmailTemplate email="test@example.com" message="Test message" />,
    );

    await waitFor(() => {
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "http://localhost:3000/logo.png");
    });

    vi.unstubAllEnvs();
  });
});
