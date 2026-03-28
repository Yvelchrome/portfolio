import * as WindowEnv from "utils/HasWindow";

/**
 * Mocks SSR environment (window = undefined)
 */
export const mockSSR = () =>
  vi.spyOn(WindowEnv, "hasWindow").mockReturnValue(false);

/**
 * Mocks browser environment (window = defined)
 */
export const mockBrowser = () =>
  vi.spyOn(WindowEnv, "hasWindow").mockReturnValue(true);
