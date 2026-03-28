import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ContactEmailTemplate from "emails/ContactEmailTemplate";
import { resetBaseUrlCache } from "utils/GetBaseUrl";

describe("ContactEmailTemplate renders logo correctly", () => {
  afterEach(() => {
    resetBaseUrlCache();
  });

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

  it.each`
    env                  | expected
    ${"not-development"} | ${"https://svgd.vercel.app"}
    ${"development"}     | ${"http://localhost:3000"}
  `("renders correct logo for NODE_ENV=$env", ({ env, expected }) => {
    vi.stubEnv("NODE_ENV", env as string);

    render(
      <ContactEmailTemplate email="test@example.com" message="Test message" />,
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", `${String(expected)}/logo.png`);
  });
});
