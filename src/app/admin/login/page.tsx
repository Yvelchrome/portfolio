"use client";

import { type ChangeEvent, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { login } from "features/admin/auth/api";
import { useAuthStore } from "features/admin/auth/store";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setError, error, isLoading, setLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    login({ email, password })
      .then((response) => {
        setUser(response.user);
        router.push("/admin");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Login failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-8 sm:px-8">
      <div className="bg-card w-full max-w-md space-y-6 rounded-lg p-6 shadow-md sm:space-y-8 sm:p-8">
        <div>
          <h2 className="text-card-foreground text-fluid-2xl mt-4 text-center font-extrabold sm:mt-6">
            Admin Login
          </h2>
        </div>

        {error && (
          <div className="bg-destructive/10 rounded-md p-4">
            <div className="text-destructive text-fluid-base">{error}</div>
          </div>
        )}

        <form
          className="mt-6 space-y-5 sm:mt-8 sm:space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary relative block w-full appearance-none rounded-md border px-3 py-2 shadow-sm focus:z-10 focus:ring-1 focus:outline-none"
                placeholder="Email address"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary relative block w-full appearance-none rounded-md border px-3 py-2 shadow-sm focus:z-10 focus:ring-1 focus:outline-none"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary relative flex w-full cursor-pointer justify-center rounded-md border border-transparent px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center sm:text-left">
            <Link
              href="/"
              className="text-primary hover:text-primary/80 text-fluid-base"
            >
              ← Back to Portfolio
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
