"use client";

import { useEffect, useState } from "react";

import { CSRFResponseSchema, parseJsonWithZod } from "lib/schemas";

export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/api/csrf-token");
        const data = await parseJsonWithZod(res, CSRFResponseSchema);
        setCsrfToken(data.csrfToken);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch CSRF token";
        console.error("Failed to fetch CSRF token:", errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchToken();
  }, []);

  return { csrfToken, error, isLoading };
}
