import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyAccessToken } from "lib/auth/jwt";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If already logged in, redirect to admin dashboard
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (token) {
    const payload = verifyAccessToken(token);
    if (payload) {
      redirect("/admin");
    }
  }

  return children;
}
