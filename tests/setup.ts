import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

const DUMMY_JWT_SECRET = "dummy-jwt-secret-key-32-chars-min!";
const DUMMY_JWT_REFRESH_SECRET = "dummy-refresh-secret-32-char-min!";
const DUMMY_RESEND_API_KEY = "re_dummy_test_key_123456789";
const DUMMY_TARGET_EMAIL = "test@example.com";
const DUMMY_DATABASE_URL = "file:./test.db";

vi.stubEnv("JWT_SECRET", DUMMY_JWT_SECRET);
vi.stubEnv("JWT_REFRESH_SECRET", DUMMY_JWT_REFRESH_SECRET);
vi.stubEnv("RESEND_API_KEY", DUMMY_RESEND_API_KEY);
vi.stubEnv("TARGET_EMAIL", DUMMY_TARGET_EMAIL);
vi.stubEnv("DATABASE_URL", DUMMY_DATABASE_URL);

beforeEach(() => {
  vi.stubEnv("JWT_SECRET", DUMMY_JWT_SECRET);
  vi.stubEnv("JWT_REFRESH_SECRET", DUMMY_JWT_REFRESH_SECRET);
  vi.stubEnv("RESEND_API_KEY", DUMMY_RESEND_API_KEY);
  vi.stubEnv("TARGET_EMAIL", DUMMY_TARGET_EMAIL);
  vi.stubEnv("DATABASE_URL", DUMMY_DATABASE_URL);

  cleanup();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi
    .fn<(query: string) => MediaQueryList>()
    .mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
});

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];

  disconnect(): void {}
  observe(): void {}
  unobserve(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
globalThis.IntersectionObserver = MockIntersectionObserver;

class MockResizeObserver implements ResizeObserver {
  disconnect(): void {}
  observe(): void {}
  unobserve(): void {}
}
globalThis.ResizeObserver = MockResizeObserver;
