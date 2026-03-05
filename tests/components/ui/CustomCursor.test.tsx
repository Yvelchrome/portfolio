import { type ReactElement } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  BASE_CURSOR_SIZE,
  CustomCursor,
  MAX_CURSOR_SIZE,
  isHoveringClickable,
} from "components/ui/CustomCursor";
import { useMediaQuery } from "lib/hooks/useMediaQuery";
import { useMounted } from "lib/hooks/useMounted";

vi.mock("lib/hooks/useMounted", () => ({ useMounted: vi.fn(() => true) }));
vi.mock("lib/hooks/useMediaQuery", () => ({
  useMediaQuery: vi.fn(() => true),
}));

const useMountedMock = vi.mocked(useMounted);
const useMediaQueryMock = vi.mocked(useMediaQuery);

describe("CustomCursor", () => {
  it("renders cursor when mounted and fine pointer available", () => {
    render(<CustomCursor />);
    expect(screen.getByTestId("custom-cursor")).toBeInTheDocument();
  });

  it("does not render when fine pointer is not available", () => {
    useMediaQueryMock.mockReturnValueOnce(false);
    const { container } = render(<CustomCursor />);
    expect(container.firstChild).toBeNull();
  });

  it("does not render when not mounted", () => {
    useMountedMock.mockReturnValueOnce(false);
    const { container } = render(<CustomCursor />);
    expect(container.firstChild).toBeNull();
  });

  describe("cursor animations", () => {
    const cursorHoverTest = async (
      element: ReactElement<{ "data-testid": string }>,
      shouldBeClickable: boolean,
    ) => {
      render(
        <div>
          <CustomCursor />
          {element}
        </div>,
      );

      const cursor = screen.getByTestId("custom-cursor");
      const target = screen.getByTestId(element.props["data-testid"]);

      expect(cursor.style.width).toBe(`${String(BASE_CURSOR_SIZE)}px`);
      expect(cursor.style.height).toBe(`${String(BASE_CURSOR_SIZE)}px`);

      fireEvent.mouseOver(target);
      const expectedHoverSize = shouldBeClickable
        ? MAX_CURSOR_SIZE
        : BASE_CURSOR_SIZE;
      await waitFor(() => {
        expect(cursor.style.width).toBe(`${String(expectedHoverSize)}px`);
        expect(cursor.style.height).toBe(`${String(expectedHoverSize)}px`);
      });

      fireEvent.mouseOut(target);
      await waitFor(() => {
        expect(cursor.style.width).toBe(`${String(BASE_CURSOR_SIZE)}px`);
        expect(cursor.style.height).toBe(`${String(BASE_CURSOR_SIZE)}px`);
      });
    };

    it("does animate when target IS a button", async () => {
      await cursorHoverTest(
        <button data-testid="button">Clickable</button>,
        true,
      );
    });

    it("does animate when target IS a anchor", async () => {
      await cursorHoverTest(<a data-testid="a">Clickable</a>, true);
    });

    it("does not animate when target IS instanceof HTMLElement AND IS NOT button or a", async () => {
      await cursorHoverTest(<div data-testid="div">Not clickable</div>, false);
    });

    it("updates cursor position on mouse move", async () => {
      const targetedClientPosition = 100;
      const expectedCursorPosition =
        targetedClientPosition - BASE_CURSOR_SIZE / 2;

      render(<CustomCursor />);
      const cursor = screen.getByTestId("custom-cursor");

      expect(cursor.style.left).toBe("0px");
      expect(cursor.style.top).toBe("0px");

      fireEvent.mouseMove(window, {
        clientX: targetedClientPosition,
        clientY: targetedClientPosition,
      });

      await waitFor(() => {
        expect(cursor.style.left).toBe(`${String(expectedCursorPosition)}px`);
        expect(cursor.style.top).toBe(`${String(expectedCursorPosition)}px`);
      });
    });
  });

  describe("isHoveringClickable | helper", () => {
    it("returns true when target IS a button or a anchor", () => {
      expect(isHoveringClickable(document.createElement("button"))).toBe(true);
      expect(isHoveringClickable(document.createElement("a"))).toBe(true);
    });

    it("returns false when target IS NOT instanceof HTMLElement OR IS NOT button or a", () => {
      expect(isHoveringClickable(document.createElement("div"))).toBe(false);
      expect(isHoveringClickable(null)).toBe(false);
    });
  });
});
