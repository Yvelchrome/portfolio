"use client";

import { useTranslations } from "next-intl";

export interface PaginationControlsProps {
  currentPage: number;
  hasNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const PaginationControls = ({
  currentPage,
  hasNextPage,
  onPrevious,
  onNext,
}: PaginationControlsProps) => {
  const t = useTranslations("Admin");

  return (
    <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
      <button
        onClick={onPrevious}
        disabled={currentPage <= 1}
        className="border-border bg-card text-foreground w-full rounded-md border px-4 py-2 enabled:cursor-pointer disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
      >
        <span>{t("messages.previous")}</span>
      </button>
      <span className="no-locale-animation text-muted-foreground text-fluid-sm px-2 py-2">
        {t("messages.page_number", { page: currentPage })}
      </span>
      <button
        onClick={onNext}
        disabled={!hasNextPage}
        className="border-border bg-card text-foreground w-full rounded-md border px-4 py-2 enabled:cursor-pointer disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
      >
        <span>{t("messages.next")}</span>
      </button>
    </div>
  );
};
