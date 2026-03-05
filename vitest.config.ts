import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    typecheck: { enabled: true },
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary", "html"],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 95,
        statements: 95,
      },
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData",
        "src/types",
      ],
    },
    testTimeout: 5000,
  },
});
