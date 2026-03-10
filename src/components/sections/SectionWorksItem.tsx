import type { ReactNode } from "react";

import Link from "next/link";

import { useTranslations } from "next-intl";

interface SectionWorksItemProps {
  title: string;
  subtitle: string;
  role: string;
  description: string;
  linkHref: string;
  client?: string;
  year?: string;
  brandLogo?: ReactNode;
  brandLogoAlt?: string;
}

export const SectionWorksItem = ({
  title,
  subtitle,
  role,
  description,
  linkHref,
  client,
  year,
  brandLogo,
  brandLogoAlt,
}: SectionWorksItemProps) => {
  const t = useTranslations("Section.WorksItem");

  return (
    <Link
      href={linkHref}
      className="bg-light-black group no-locale-animation text-primary-text-dark relative flex w-full cursor-pointer flex-col justify-between rounded-2xl p-8"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-fluid-5xl no-locale-animation font-semibold">
            {title}
          </h3>
          <p className="text-fluid-2xl font-medium text-gray-400">{subtitle}</p>
        </div>
        <p className="text-fluid-4xl font-medium text-gray-400">{role}</p>
        <p className="text-fluid-4xl">{description}</p>
      </div>

      <div className="*:text-fluid-base pt-8 *:text-gray-400">
        <p>
          {t("client")} : {client}
        </p>
        <p>
          {t("year")} : {year}
        </p>
      </div>

      <div className="absolute inset-0 hidden overflow-clip rounded-2xl sm:block">
        <span
          role="img"
          aria-label={brandLogoAlt}
          className="no-locale-animation absolute top-4 -right-1/8 aspect-square h-auto w-1/3 max-w-40 transition-[right]! duration-500! *:pointer-events-none *:aspect-square *:h-full *:w-full group-hover:right-4"
        >
          {brandLogo}
        </span>
      </div>
    </Link>
  );
};
