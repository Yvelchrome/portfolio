"use client";

import { useTranslations } from "next-intl";

type MessageStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

interface StatusBadgeProps {
  status: MessageStatus;
  size?: "md" | "lg";
}

const statusColors: Record<MessageStatus, string> = {
  NEW: "bg-yellow-500/10 text-yellow-500",
  READ: "bg-blue-500/10 text-blue-500",
  REPLIED: "bg-green-500/10 text-green-500",
  ARCHIVED: "bg-muted text-muted-foreground",
};

const sizeClasses = {
  md: "px-2 py-1 text-xs",
  lg: "px-3 py-1 text-sm",
};

export const StatusBadge = ({ status, size = "md" }: StatusBadgeProps) => {
  const tCommon = useTranslations("Common");

  return (
    <div
      className={`w-fit rounded-full ${sizeClasses[size]} ${statusColors[status]}`}
    >
      <span>{tCommon(`status.${status.toLowerCase()}`)}</span>
    </div>
  );
};
