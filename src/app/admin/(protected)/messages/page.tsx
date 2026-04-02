"use client";

import { useMemo } from "react";

import Link from "next/link";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import {
  PaginationControls,
  SelectFilter,
  StateMessage,
  StatusBadge,
} from "features/admin/components";
import { useReplaceUrl } from "features/admin/hooks/useReplaceUrl";
import { useSearchParamsSafe } from "features/admin/hooks/useSearchParamsSafe";
import { deleteMessage, getMessages } from "features/admin/messages/api";

const PAGE_SIZE = 10;
const CURSOR_STORAGE_KEY = "messages_cursors";

export default function MessagesPage() {
  const queryClient = useQueryClient();
  const t = useTranslations("Admin");
  const tCommon = useTranslations("Common");
  const locale = useLocale();

  const { demo, page, status } = useSearchParamsSafe(
    ["demo", "page", "status"],
    { demo: "0", page: "1", status: "" },
  );
  const isDemo = demo === "1";
  const currentPage = parseInt(page);

  const replaceUrl = useReplaceUrl(isDemo);

  const cursor = useMemo(() => {
    if (currentPage <= 1) return undefined;

    return (
      sessionStorage.getItem(`${CURSOR_STORAGE_KEY}_${String(currentPage)}`) ??
      undefined
    );
  }, [currentPage]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["messages", status, cursor, isDemo],
    queryFn: () =>
      getMessages({
        cursor,
        limit: PAGE_SIZE,
        status,
        isDemo,
      }),
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

  const handleStatusChange = (newStatus: string) => {
    for (let i = 2; i <= currentPage + 10; i++) {
      sessionStorage.removeItem(`${CURSOR_STORAGE_KEY}_${String(i)}`);
    }

    replaceUrl({ page: 1, status: newStatus });
  };

  const handleDeleteClick = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handlePreviousPage = () => {
    if (currentPage <= 1) return;

    const prevPage = currentPage - 1;

    replaceUrl({ page: prevPage, status });
  };

  const handleNextPage = () => {
    if (
      data?.pagination &&
      "cursor" in data.pagination &&
      data.pagination.cursor
    ) {
      const nextPage = currentPage + 1;

      sessionStorage.setItem(
        `${CURSOR_STORAGE_KEY}_${String(nextPage)}`,
        data.pagination.cursor,
      );

      replaceUrl({ page: nextPage, status });
    }
  };

  const messages = data?.messages || [];
  const pagination = data?.pagination;

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-primary-text text-fluid-2xl font-bold">
          {t("messages.title")}
        </h1>

        {pagination && (
          <PaginationControls
            currentPage={currentPage}
            hasNextPage={pagination.hasNextPage}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
          />
        )}

        <SelectFilter
          value={status}
          onChange={handleStatusChange}
          options={[
            { value: "", label: tCommon("status.all") },
            { value: "NEW", label: tCommon("status.new") },
            { value: "READ", label: tCommon("status.read") },
            { value: "REPLIED", label: tCommon("status.replied") },
            { value: "ARCHIVED", label: tCommon("status.archived") },
          ]}
        />
      </div>

      {isLoading || isFetching ? (
        <StateMessage message={t("messages.loading")} />
      ) : messages.length === 0 ? (
        <StateMessage message={t("messages.no_messages_found")} />
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
                        <StatusBadge status={message.status} />
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
                    <StatusBadge status={message.status} />
                  </div>
                  <p className="text-foreground mt-2 truncate">
                    {message.subject}
                  </p>
                  <p className="text-muted-foreground text-fluid-sm mt-1">
                    {new Date(message.createdAt).toLocaleDateString(locale)}
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
                      <span>{t("messages.delete")}</span>
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
