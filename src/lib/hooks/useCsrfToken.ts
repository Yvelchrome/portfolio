"use client";

import { useState, useEffect } from "react";

interface CSRFResponse {
  token: string | undefined;
}

export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | undefined>("");
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/csrf-token")
      .then((res) => res.json())
      .then((data: CSRFResponse) => {
        setCsrfToken(data.token);
      })
      .catch((error: Error) => {
        console.error("Failed to fetch CSRF token:", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { csrfToken, error, loading };
}
