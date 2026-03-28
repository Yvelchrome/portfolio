import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CustomButton } from "components/ui/CustomButton";

describe("CustomButton Component", () => {
  it("renders with text", () => {
    render(<CustomButton text="Click me" />);

    expect(screen.getByText("Click me")).toBeInTheDocument();
    expect(screen.getByText("→")).toBeInTheDocument();
    expect(screen.queryByText("←")).not.toBeInTheDocument();
  });

  it("renders left arrow when arrowPosition is left", () => {
    render(<CustomButton text="Back" arrowPosition="left" />);

    expect(screen.queryByText("→")).not.toBeInTheDocument();
    expect(screen.getByText("←")).toBeInTheDocument();
  });

  it.each`
    props                          | matches
    ${{ arrowRotationDegree: 90 }} | ${(el: CSSStyleDeclaration) => el.transform === "rotate(90deg)"}
    ${{ yAnimate: true }}          | ${(el: CSSStyleDeclaration) => /translateY/i.test(el.transform)}
    ${{ yAnimate: false }}         | ${(el: CSSStyleDeclaration) => !/translateY/i.test(el.transform)}
  `(
    "applies style correctly",
    async ({
      props,
      matches,
    }: {
      props: { arrowRotationDegree?: number; yAnimate?: boolean };
      matches: (el: CSSStyleDeclaration) => boolean;
    }) => {
      render(<CustomButton text="Test" {...props} />);
      const arrow = screen.getByText("→");

      await waitFor(() => {
        const computed = getComputedStyle(arrow);
        expect(matches(computed)).toBe(true);
      });
    },
  );
});
