"use client";

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import {
  SelectFilter,
  StateMessage,
  StatusBadge,
} from "features/admin/components";
import { useSearchParamsSafe } from "features/admin/hooks/useSearchParamsSafe";
import { getMessage, updateMessage } from "features/admin/messages/api";

export default function MessageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("Admin");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const [newStatus, setNewStatus] = useState("NOTHING");

  const { demo } = useSearchParamsSafe(["demo"], { demo: "0" });
  const isDemo = demo === "1";

  const rawId = params["id"];
  const messageId = typeof rawId === "string" ? rawId : "";

  const { data: message, isLoading } = useQuery({
    queryKey: ["message", messageId, isDemo],
    queryFn: () => getMessage(messageId, isDemo),
    enabled: !!messageId,
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
    if (newStatus && newStatus !== "NOTHING") {
      updateMutation.mutate({ status: newStatus });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return <StateMessage message={t("messages.loading")} />;
  }

  if (!message) {
    return <StateMessage message={t("messages.no_messages_found")} />;
  }

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
          <StatusBadge status={message.status} size="lg" />
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
            <SelectFilter
              value={newStatus}
              onChange={setNewStatus}
              options={[
                { value: "NOTHING", label: tCommon("filter_select_one") },
                { value: "NEW", label: tCommon("status.new") },
                { value: "READ", label: tCommon("status.read") },
                { value: "REPLIED", label: tCommon("status.replied") },
                { value: "ARCHIVED", label: tCommon("status.archived") },
              ]}
            />
            <button
              onClick={handleStatusChange}
              disabled={
                !newStatus ||
                newStatus === "NOTHING" ||
                updateMutation.isPending
              }
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
