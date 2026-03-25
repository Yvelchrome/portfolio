let cachedBaseUrl: string | undefined;

/**
 * Returns the base URL depending on environment.
 * Can manually override `env` for testing purposes.
 */
export const getBaseUrl = (env?: string): string => {
  if (cachedBaseUrl) return cachedBaseUrl;

  const currentEnv = env ?? process.env.NODE_ENV;

  cachedBaseUrl =
    currentEnv === "development"
      ? "http://localhost:3000"
      : "https://svgd.vercel.app";

  return cachedBaseUrl;
};

export const resetBaseUrlCache = (): void => {
  cachedBaseUrl = undefined;
};
