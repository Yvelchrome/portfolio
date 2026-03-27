import Link from "next/link";

import { useTranslations } from "next-intl";

import { Button } from "components/shadcn/button";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <section className="flex min-h-dvh flex-col items-center justify-center text-center">
      <h1 className="no-locale-animation text-fluid-9xl text-primary-text">
        {t("title")}
      </h1>
      <p className="text-fluid-2xl text-muted-foreground mt-4">
        {t("subtitle")}
      </p>
      <p className="text-fluid-base text-muted-foreground mt-2">
        {t("description")}
      </p>
      <Button className="no-locale-animation mt-8" asChild>
        <Link href="/">
          <span>{t("back_to_home")}</span>
        </Link>
      </Button>
    </section>
  );
}
