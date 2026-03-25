"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { logout } from "features/admin/auth/api";
import { useAuthStore } from "features/admin/auth/store";
import { getMessageStats, getMessages } from "features/admin/messages/api";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

import { type MessageStats } from "lib/schemas";

export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Admin");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const { user, logout: clearAuth } = useAuthStore();

  const isDemo = searchParams.get("demo") === "1";

  const { data: stats } = useQuery<MessageStats>({
    queryKey: ["messageStats", isDemo],
    queryFn: () => getMessageStats(isDemo),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["messages", { limit: 5, demo: isDemo }],
    queryFn: () => getMessages({ limit: 5, demo: isDemo }),
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Continue with local logout even if API fails - keep this comment as it's intentional behavior
    }
    clearAuth();
    router.push("/admin/login");
  };

  const onLogoutClick = () => {
    void handleLogout();
  };

  const recentMessages = data?.messages || [];

  const statusColors: Record<string, string> = {
    NEW: "bg-yellow-500/10 text-yellow-500",
    READ: "bg-blue-500/10 text-blue-500",
    REPLIED: "bg-green-500/10 text-green-500",
    ARCHIVED: "bg-muted text-muted-foreground",
  };

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-primary-text text-fluid-2xl font-bold">
            {t("dashboard")}
          </h2>
          <p className="text-muted-foreground text-fluid-base mt-1">
            {t("welcome_back", { name: user?.name || user?.email || "" })}
          </p>
        </div>
        <button
          onClick={onLogoutClick}
          className="text-destructive hover:bg-destructive/10 no-locale-animation w-full cursor-pointer rounded-md px-4 py-2 text-sm sm:w-auto"
        >
          <span>{t("logout")}</span>
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-3">
        <div className="bg-card overflow-hidden rounded-lg p-4 shadow sm:p-6">
          <dt className="text-muted-foreground text-fluid-sm truncate font-medium uppercase">
            <span>{t("total_messages")}</span>
          </dt>
          <dd className="text-primary-text text-fluid-2xl mt-1 font-semibold">
            <span className="no-locale-animation tabular-nums">
              {stats?.total ?? 0}
            </span>
          </dd>
        </div>
        <div className="bg-card overflow-hidden rounded-lg p-4 shadow sm:p-6">
          <dt className="text-muted-foreground text-fluid-sm truncate font-medium uppercase">
            <span>{t("unread")}</span>
          </dt>
          <dd className="text-fluid-2xl mt-1 font-semibold text-yellow-500">
            <span className="no-locale-animation tabular-nums">
              {stats?.unread ?? 0}
            </span>
          </dd>
        </div>
        <div className="bg-card overflow-hidden rounded-lg p-4 shadow sm:p-6">
          <dt className="text-muted-foreground text-fluid-sm truncate font-medium uppercase">
            <span>{t("replied")}</span>
          </dt>
          <dd className="text-fluid-2xl mt-1 font-semibold text-green-500">
            <span className="no-locale-animation tabular-nums">
              {stats?.replied ?? 0}
            </span>
          </dd>
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-lg shadow">
        <div className="border-border flex items-center justify-between border-b p-4 sm:p-6">
          <h3 className="text-card-foreground text-fluid-base font-semibold">
            {t("recent_messages")}
          </h3>
          <Link
            href={`/admin/messages${isDemo ? "?demo=1" : ""}`}
            className="text-blue-500 hover:text-blue-400"
          >
            {t("view_all")} →
          </Link>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground p-6 text-center">
            {t("messages.loading")}
          </div>
        ) : recentMessages.length === 0 ? (
          <div className="text-muted-foreground p-6 text-center">
            <span>{t("no_messages")}</span>
          </div>
        ) : (
          <div className="divide-border divide-y">
            {recentMessages.map((message) => (
              <div key={message.id} className="hover:bg-muted/50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-card-foreground no-locale-animation truncate font-medium">
                      {message.name}
                    </p>
                    <p className="text-muted-foreground no-locale-animation text-fluid-sm">
                      {message.email}
                    </p>
                  </div>
                  <div
                    className={`w-fit rounded-full px-2 py-1 text-xs ${
                      statusColors[message.status] ??
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    <span>
                      {tCommon(`status.${message.status.toLowerCase()}`)}
                    </span>
                  </div>
                </div>
                <p className="text-foreground no-locale-animation mt-2 truncate">
                  {message.subject}
                </p>
                <p className="text-muted-foreground no-locale-animation text-fluid-sm mt-1">
                  {new Date(message.createdAt).toLocaleDateString(locale)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
