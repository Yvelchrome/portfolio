import { vi } from "vitest";

import { NextRequest } from "next/server";

export interface RequestOptions {
  method?: string;
  body?: unknown;
}

/**
 * Creates an authenticated NextRequest with accessToken cookie
 */
export const createAuthRequest = (
  url: string,
  token: string,
  options: RequestOptions = {},
): NextRequest => {
  const init = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
  } as const;

  let request: NextRequest;

  if (options.body) {
    const bodyInit = {
      ...init,
      body: JSON.stringify(options.body),
    } as const;
    request = new NextRequest(`http://localhost:3000${url}`, bodyInit);
  } else {
    request = new NextRequest(`http://localhost:3000${url}`, init);
  }

  const cookieGetMock = vi.fn(
    (
      name: string,
    ):
      | { name: string; value: string; path: string; httpOnly: boolean }
      | undefined => {
      if (name === "accessToken") {
        return {
          name: "accessToken",
          value: token,
          path: "/",
          httpOnly: true,
        };
      }
      return undefined;
    },
  );

  Object.defineProperty(request.cookies, "get", {
    value: cookieGetMock,
    writable: true,
  });

  return request;
};

/**
 * Creates an unauthenticated NextRequest
 */
export const createRequest = (
  url: string,
  options: RequestOptions = {},
): NextRequest => {
  const init = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
  } as const;

  if (options.body) {
    const bodyInit = {
      ...init,
      body: JSON.stringify(options.body),
    } as const;
    return new NextRequest(`http://localhost:3000${url}`, bodyInit);
  }

  return new NextRequest(`http://localhost:3000${url}`, init);
};
