import { describe, it, expect } from "vitest";

describe("Example Test", () => {
  it("should pass basic math", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle strings", () => {
    expect("hello").toBe("hello");
  });

  it("should check arrays", () => {
    const arr = [1, 2, 3];
    expect(arr).toContain(2);
    expect(arr).toHaveLength(3);
  });
});
