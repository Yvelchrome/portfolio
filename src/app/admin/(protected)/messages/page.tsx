"use client";

import { type ChangeEvent, useCallback, useMemo } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMessage, getMessages } from "features/admin/messages/api";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

const PAGE_SIZE = 10;
const CURSOR_STORAGE_KEY = "messages_cursors";

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const t = useTranslations("Admin");
  const tCommon = useTranslations("Common");
  const locale = useLocale();

  const pageParam = searchParams.get("page");
  const statusFilter = searchParams.get("status") ?? "";
  const isDemo = searchParams.get("demo") === "1";
  const currentPage = parseInt(pageParam ?? "1", 10);

  const cursor = useMemo(() => {
    if (currentPage <= 1) return undefined;

    return (
      sessionStorage.getItem(`${CURSOR_STORAGE_KEY}_${String(currentPage)}`) ??
      undefined
    );
  }, [currentPage]);

  const buildUrl = useCallback(
    (page: number, status?: string, demo?: boolean) => {
      const params = new URLSearchParams();
      params.set("page", String(page));

      if (status !== undefined) {
        if (status) params.set("status", status);
      } else if (statusFilter) {
        params.set("status", statusFilter);
      }

      if (demo) params.set("demo", "1");

      return `/admin/messages?${params}`;
    },
    [statusFilter],
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["messages", statusFilter, cursor, isDemo],
    queryFn: () => {
      const params: {
        cursor?: string;
        limit: number;
        status?: string;
        demo?: boolean;
      } = {
        limit: PAGE_SIZE,
      };
      if (cursor) params.cursor = cursor;
      if (statusFilter) params.status = statusFilter;
      if (isDemo) params.demo = true;
      return getMessages(params);
    },
    staleTime: 0,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["messages"],
        refetchType: "all",
      });
      void queryClient.invalidateQueries({ queryKey: ["messageStats"] });
    },
  });

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    for (let i = 2; i <= currentPage + 10; i++) {
      sessionStorage.removeItem(`${CURSOR_STORAGE_KEY}_${String(i)}`);
    }
    router.push(buildUrl(1, newStatus, isDemo));
  };

  const handleDeleteClick = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handlePreviousPage = () => {
    router.push(buildUrl(currentPage - 1, undefined, isDemo));
  };

  const handleNextPage = () => {
    if (
      data?.pagination &&
      "cursor" in data.pagination &&
      data.pagination.cursor
    ) {
      sessionStorage.setItem(
        `${CURSOR_STORAGE_KEY}_${String(currentPage + 1)}`,
        data.pagination.cursor,
      );
      router.push(buildUrl(currentPage + 1, undefined, isDemo));
    }
  };

  const messages = data?.messages || [];
  const pagination = data?.pagination;

  const statusColors: Record<string, string> = {
    NEW: "bg-yellow-500/10 text-yellow-500",
    READ: "bg-blue-500/10 text-blue-500",
    REPLIED: "bg-green-500/10 text-green-500",
    ARCHIVED: "bg-muted text-muted-foreground",
  };

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-primary-text text-fluid-2xl font-bold">
          {t("messages.title")}
        </h1>

        {pagination && (
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              className="border-border bg-card text-foreground w-full rounded-md border px-4 py-2 enabled:cursor-pointer disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
            >
              <span>{t("messages.previous")}</span>
            </button>
            <span className="no-locale-animation text-muted-foreground text-fluid-sm px-2 py-2">
              {t("messages.page_number", { page: currentPage })}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage}
              className="border-border bg-card text-foreground w-full rounded-md border px-4 py-2 enabled:cursor-pointer disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
            >
              <span>{t("messages.next")}</span>
            </button>
          </div>
        )}

        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="border-border bg-card text-foreground text-fluid-base w-full cursor-pointer rounded-md border px-3 py-2 sm:w-auto sm:px-4"
        >
          <option value="">{t("messages.all_status")}</option>
          <option value="NEW">New</option>
          <option value="READ">Read</option>
          <option value="REPLIED">Replied</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground py-12 text-center">
          {t("messages.loading")}
        </div>
      ) : isFetching ? (
        <div className="text-muted-foreground py-12 text-center">
          {t("messages.loading_more")}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          {t("messages.no_messages_found")}
        </div>
      ) : (
        <>
          <div className="bg-card overflow-hidden rounded-lg shadow">
            {/* Desktop table view */}
            <div className="hidden min-w-full overflow-x-auto sm:block">
              <table className="divide-border min-w-full divide-y">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase lg:px-6">
                      {t("messages.name")}
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase lg:px-6">
                      {t("messages.subject")}
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase lg:px-6">
                      {t("messages.status")}
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase lg:px-6">
                      {t("messages.date")}
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-right text-xs font-medium uppercase lg:px-6">
                      {t("messages.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-border bg-card divide-y">
                  {messages.map((message) => (
                    <tr key={message.id} className="hover:bg-muted/50">
                      <td className="px-4 py-4 lg:px-6">
                        <p className="text-card-foreground no-locale-animation font-medium">
                          {message.name}
                        </p>
                        <p className="text-muted-foreground text-fluid-sm no-locale-animation">
                          {message.email}
                        </p>
                      </td>
                      <td className="text-foreground px-4 py-4 lg:px-6">
                        <p className="no-locale-animation">{message.subject}</p>
                      </td>
                      <td className="px-4 py-4 lg:px-6">
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
                      </td>
                      <td className="text-muted-foreground text-fluid-sm px-4 py-4 lg:px-6">
                        <p className="no-locale-animation">
                          {new Date(message.createdAt).toLocaleDateString(
                            locale,
                          )}
                        </p>
                      </td>
                      <td className="space-x-4 px-4 py-4 text-right lg:px-6">
                        <Link
                          href={`/admin/messages/${message.id}${isDemo ? "?demo=1" : ""}`}
                          className="text-blue-500 hover:text-blue-400"
                        >
                          <span>{t("messages.view")}</span>
                        </Link>
                        <button
                          onClick={() => {
                            handleDeleteClick(message.id);
                          }}
                          className="text-destructive hover:text-destructive/80 cursor-pointer"
                        >
                          <span>{t("messages.delete")}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="divide-border divide-y sm:hidden">
              {messages.map((message) => (
                <div key={message.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-card-foreground font-medium">
                        {message.name}
                      </p>
                      <p className="text-muted-foreground text-fluid-sm">
                        {message.email}
                      </p>
                    </div>
                    <div
                      className={`w-fit rounded-full px-2 py-1 text-xs ${
                        statusColors[message.status] ??
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span className="no-locale-animation">
                        {tCommon(`status.${message.status.toLowerCase()}`)}
                      </span>
                    </div>
                  </div>
                  <p className="text-foreground mt-2 truncate">
                    {message.subject}
                  </p>
                  <p className="text-muted-foreground text-fluid-sm mt-1">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-3 flex gap-4">
                    <Link
                      href={`/admin/messages/${message.id}`}
                      className="text-blue-500 hover:text-blue-400"
                    >
                      {t("messages.view")}
                    </Link>
                    <button
                      onClick={() => {
                        handleDeleteClick(message.id);
                      }}
                      className="text-destructive hover:text-destructive/80"
                    >
                      {t("messages.delete")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
