"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { Checkbox } from "components/shadcn/checkbox";

export function AdminNavClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("Admin");

  const isDemo = searchParams.get("demo") === "1";

  const navLinks = [
    { href: "/admin", label: t("dashboard") },
    { href: "/admin/messages", label: t("messages.title") },
    { href: "/admin/statistics", label: t("statistics.title") },
  ];

  const getLinkWithDemo = (href: string) => {
    const params = new URLSearchParams(searchParams);

    if (href !== "/admin/messages") {
      params.delete("page");
    }

    if (isDemo) {
      params.set("demo", "1");
    }

    return `${href}?${params}`;
  };

  const toggleDemo = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);

    if (pathname === "/admin/messages") {
      params.set("page", "1");
    } else {
      params.delete("page");
    }

    if (checked) {
      params.set("demo", "1");
    } else {
      params.delete("demo");
    }

    router.push(`${pathname}?${params}`);
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
