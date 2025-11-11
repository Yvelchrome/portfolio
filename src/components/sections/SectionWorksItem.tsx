import type { ReactNode } from "react";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { GlowingEffect } from "components";

interface SectionWorksItemProps {
  id: number;
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
  id,
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
      className="bg-light-black group relative flex w-full cursor-pointer flex-col justify-between rounded-2xl p-8 text-white"
    >
      <GlowingEffect
        blur={0}
        borderWidth={3}
        spread={60}
        glow={true}
        disabled={false}
        proximity={100}
        inactiveZone={0}
        variant="blue"
        className="*:after:duration-500"
      />
      <div className="space-y-6">
        <div>
          <h3 className="text-fluid-5xl font-semibold">{title}</h3>
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
          className="absolute -top-1/8 -right-1/8 h-1/2 w-auto !transition-[top,right] duration-500 *:h-full *:w-auto group-hover:-top-1/16 group-hover:-right-1/16"
        >
          {brandLogo}
        </span>
      </div>
    </Link>
  );
};
