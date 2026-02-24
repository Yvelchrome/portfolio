"use client";

import { useState, useEffect } from "react";
import { parseJsonWithZod, CSRFResponseSchema } from "lib/schemas";

export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/csrf-token");
        const data = await parseJsonWithZod(res, CSRFResponseSchema);
        setCsrfToken(data.csrfToken);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error("Failed to fetch CSRF token:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return { csrfToken, error, loading };
}
