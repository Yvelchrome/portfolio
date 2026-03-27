"use client";

import { useEffect } from "react";

import Link from "next/link";

import { useTranslations } from "next-intl";

import { Button } from "components/shadcn/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <section className="flex min-h-dvh flex-col items-center justify-center text-center">
      <h2 className="text-fluid-5xl text-primary-text">{t("title")}</h2>
      <p className="text-fluid-base text-muted-foreground mt-4">
        {t("description")}
      </p>
      <div className="mt-8 flex gap-4">
        <Button className="no-locale-animation" onClick={reset}>
          <span>{t("try_again")}</span>
        </Button>
        <Button className="no-locale-animation" variant="outline" asChild>
          <Link href="/">
            <span>{t("back_to_home")}</span>
          </Link>
        </Button>
      </div>
    </section>
  );
}
