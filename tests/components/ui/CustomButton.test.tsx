import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CustomButton } from "components/ui/CustomButton";

describe("CustomButton Component", () => {
  it("renders with text", () => {
    render(<CustomButton text="Click me" />);

    const text = screen.getByText("Click me");
    expect(text).toBeInTheDocument();
  });

  it("renders left arrow when arrowPosition is left", () => {
    render(<CustomButton text="Back" arrowPosition="left" />);

    const arrow = screen.getByText("←");
    expect(arrow).toBeInTheDocument();
  });

  it("applies href correctly", () => {
    render(<CustomButton text="Go" href="/home" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/home");
  });

  it("applies arrowRotationDegree correctly", () => {
    render(<CustomButton text="Spin" arrowRotationDegree={90} />);

    const arrow = screen.getByText("→");
    expect(arrow).toHaveStyle({ transform: "rotate(90deg)" });
  });
});
