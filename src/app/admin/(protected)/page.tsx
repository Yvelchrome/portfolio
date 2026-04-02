"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import { logout } from "features/admin/auth/api";
import { useAuthStore } from "features/admin/auth/store";
import { StatCard, StateMessage, StatusBadge } from "features/admin/components";
import { useSearchParamsSafe } from "features/admin/hooks/useSearchParamsSafe";
import { getMessageStats, getMessages } from "features/admin/messages/api";
import { type MessageStats } from "lib/schemas";

export default function AdminDashboard() {
  const router = useRouter();
  const t = useTranslations("Admin");
  const locale = useLocale();
  const { user, logout: clearAuth } = useAuthStore();

  const { demo } = useSearchParamsSafe(["demo"], { demo: "0" });
  const isDemo = demo === "1";

  const { data: stats } = useQuery<MessageStats>({
    queryKey: ["messageStats", isDemo],
    queryFn: () => getMessageStats(isDemo),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["messages", { limit: 5, isDemo }],
    queryFn: () => getMessages({ limit: 5, isDemo }),
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Continue with local logout even if API fails - intentional behavior
    }
    clearAuth();
    router.push("/admin/login");
  };

  const onLogoutClick = () => {
    void handleLogout();
  };

  const recentMessages = data?.messages || [];

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
        <StatCard label={t("total_messages")} value={stats?.total ?? 0} />
        <StatCard
          label={t("unread")}
          value={stats?.unread ?? 0}
          color="text-yellow-500"
        />
        <StatCard
          label={t("replied")}
          value={stats?.replied ?? 0}
          color="text-green-500"
        />
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
          <StateMessage message={t("messages.loading")} />
        ) : recentMessages.length === 0 ? (
          <StateMessage message={t("no_messages")} />
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
                  <StatusBadge status={message.status} />
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
