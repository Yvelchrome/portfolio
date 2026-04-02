"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useSearchParamsSafe } from "features/admin/hooks/useSearchParamsSafe";
import { useTranslations } from "next-intl";

import { Checkbox } from "components/shadcn/checkbox";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Admin");

  const { demo } = useSearchParamsSafe(["demo"], { demo: "0" });
  const isDemo = demo === "1";

  const navLinks = [
    { href: "/admin", label: t("dashboard") },
    { href: "/admin/messages", label: t("messages.title") },
    { href: "/admin/statistics", label: t("statistics.title") },
  ];

  const getLinkWithDemo = (href: string) => {
    const params = new URLSearchParams();

    if (href === "/admin/messages") {
      params.set("page", "1");
    }

    if (href === "/admin/statistics") {
      params.set("days", "30");
    }

    if (isDemo) {
      params.set("demo", "1");
    }

    const paramString = params.toString();
    return paramString ? `${href}?${paramString}` : href;
  };

  const toggleDemo = (checked: boolean) => {
    const params = new URLSearchParams();

    if (pathname === "/admin/messages") {
      params.set("page", "1");
    }

    if (pathname === "/admin/statistics") {
      params.set("days", "30");
    }

    if (checked) {
      params.set("demo", "1");
    }

    const paramString = params.toString();
    router.push(paramString ? `${pathname}?${paramString}` : pathname);
  };

  return (
    <nav className="bg-card mx-4 mt-4 overflow-x-auto rounded-lg px-3 py-3 shadow sm:mx-8 sm:mt-8 sm:w-fit sm:px-4 sm:py-4">
      <div className="flex min-w-max flex-col gap-2 sm:min-w-0 sm:flex-row sm:items-center sm:gap-8">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={getLinkWithDemo(link.href)}
              className={`text-fluid-base inline-flex items-center px-1 ${
                isActive
                  ? "text-card-foreground pointer-events-none font-medium"
                  : "text-muted-foreground hover:text-card-foreground"
              } `}
            >
              {link.label}
            </Link>
          );
        })}

        <label
          htmlFor="demo-mode-checkbox"
          className="text-muted-foreground text-fluid-base hover:text-card-foreground inline-flex cursor-pointer items-center gap-2 px-1"
        >
          <Checkbox
            id="demo-mode-checkbox"
            className="cursor-pointer"
            checked={isDemo}
            onCheckedChange={toggleDemo}
          />
          <span>Demo</span>
        </label>
      </div>
    </nav>
  );
}
