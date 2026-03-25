import type { ReactNode } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyAccessToken } from "lib/auth/jwt";

import { AdminNav } from "./AdminNav";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen" style={{ paddingTop: "80px" }}>
      <AdminNav />
      {children}
    </div>
  );
}
