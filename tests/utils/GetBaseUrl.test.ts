import { describe, expect, it } from "vitest";

import { getBaseUrl } from "utils/GetBaseUrl";

describe("getBaseUrl", () => {
  it("returns localhost in development", () => {
    expect(getBaseUrl("development")).toBe("http://localhost:3000");
  });

  it("returns production URL in production", () => {
    expect(getBaseUrl("not-development")).toBe("https://svgd.vercel.app");
  });
});
