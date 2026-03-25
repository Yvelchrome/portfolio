"use client";

import { type ChangeEvent, useState } from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessage, updateMessage } from "features/admin/messages/api";
import { useLocale, useTranslations } from "next-intl";

export default function MessageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const t = useTranslations("Admin");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const [newStatus, setNewStatus] = useState("");

  const rawId = params["id"];
  const messageId = typeof rawId === "string" ? rawId : "";
  const isDemo = searchParams.get("demo") === "1";

  const { data: message, isLoading } = useQuery({
    queryKey: ["message", messageId, isDemo],
    queryFn: () => getMessage(messageId, isDemo),
    enabled: rawId !== undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { status?: string; replyContent?: string }) =>
      updateMessage(messageId, data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["message", messageId] });

      const previousMessage = queryClient.getQueryData(["message", messageId]);

      if (newData.status) {
        queryClient.setQueryData(
          ["message", messageId],
          (old: { status: string } | undefined) => {
            if (old) {
              return {
                ...old,
                status: newData.status as
                  | "NEW"
                  | "READ"
                  | "REPLIED"
                  | "ARCHIVED",
              };
            }
            return old;
          },
        );
      }

      return { previousMessage };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousMessage) {
        queryClient.setQueryData(
          ["message", messageId],
          context.previousMessage,
        );
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["message", messageId] });
      void queryClient.invalidateQueries({
        queryKey: ["messages"],
        refetchType: "all",
      });
      void queryClient.invalidateQueries({ queryKey: ["messageStats"] });
      setNewStatus("");
    },
  });

  const handleStatusChange = () => {
    if (newStatus) {
      updateMutation.mutate({ status: newStatus });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleStatusSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        {t("messages.loading")}
      </div>
    );
  }

  if (!message) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        {t("messages.no_messages_found")}
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    NEW: "bg-yellow-500/10 text-yellow-500",
    READ: "bg-blue-500/10 text-blue-500",
    REPLIED: "bg-green-500/10 text-green-500",
    ARCHIVED: "bg-muted text-muted-foreground",
  };

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <button
        onClick={handleGoBack}
        className="text-fluid-base mb-4 cursor-pointer text-blue-500 hover:text-blue-400 sm:mb-6"
      >
        <span>← {tCommon("actions.go_back")}</span>
      </button>

      <div className="bg-card overflow-hidden rounded-lg p-4 shadow sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="no-locale-animation text-primary-text text-fluid-2xl font-bold">
              {message.subject}
            </h1>
            <p className="no-locale-animation text-muted-foreground text-fluid-base mt-1">
              {t("message_detail.from")}: {message.name}
            </p>
            <p className="no-locale-animation text-muted-foreground text-fluid-base">
              {message.email}
            </p>
            <p className="no-locale-animation text-muted-foreground text-fluid-base mt-1">
              {new Date(message.createdAt).toLocaleString(locale)}
            </p>
          </div>
          <span
            className={`w-fit rounded-full px-3 py-1 text-sm ${
              statusColors[message.status] ?? "bg-muted text-muted-foreground"
            }`}
          >
            {tCommon(`status.${message.status.toLowerCase()}`)}
          </span>
        </div>

        <div className="prose text-foreground mb-8 max-w-none whitespace-pre-wrap">
          <p className="no-locale-animation">{message.content}</p>
        </div>

        {message.replyContent && (
          <div className="mb-8 border-l-4 border-green-500 bg-green-500/10 p-4">
            <h3 className="font-semibold text-green-500">
              {t("message_detail.reply_sent")}
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-green-500/80">
              {message.replyContent}
            </p>
            <p className="text-fluid-base mt-2 text-green-500/60">
              {t("message_detail.replied_on", {
                date: message.repliedAt
                  ? new Date(message.repliedAt).toLocaleString(locale)
                  : "N/A",
              })}
            </p>
          </div>
        )}

        <div className="border-border border-t pt-6">
          <h3 className="text-card-foreground text-fluid-base mb-4 font-semibold">
            {t("message_detail.change_status")}
          </h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={newStatus}
              onChange={handleStatusSelectChange}
              className="border-input bg-card text-foreground w-full cursor-pointer rounded-md border px-3 py-2 sm:w-auto sm:px-4"
            >
              <option value="">{t("message_detail.select_status")}</option>
              <option value="NEW">{tCommon("status.new")}</option>
              <option value="READ">{tCommon("status.read")}</option>
              <option value="REPLIED">{tCommon("status.replied")}</option>
              <option value="ARCHIVED">{tCommon("status.archived")}</option>
            </select>
            <button
              onClick={handleStatusChange}
              disabled={!newStatus || updateMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2 enabled:cursor-pointer disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:px-6"
            >
              <span>{t("message_detail.update_status")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
