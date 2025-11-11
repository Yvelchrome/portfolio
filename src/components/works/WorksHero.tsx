import type { ReactElement } from "react";

import * as motion from "motion/react-client";
import { fadeInFromTop } from "lib/animationsVariants";

import { useTranslations } from "next-intl";

import { ScrollIndication } from "components";
import { Badge } from "components/shadcn/badge";

interface WorksHeroProps {
  WorkLogo: ReactElement;
  title: string;
  subtitle: string;
  frontStack?: Array<string>;
  backStack?: Array<string>;
  client?: string;
  year?: string;
  role: string;
  linkToWebsite?: string;
  linkToRepository?: string;
  isArchivedProject?: boolean;
}

export const WorksHero = ({
  WorkLogo,
  title,
  subtitle,
  frontStack,
  backStack,
  client,
  year,
  role,
  linkToWebsite,
  linkToRepository,
  isArchivedProject,
}: WorksHeroProps) => {
  const t = useTranslations("Works");

  function anchorTag(href: string, intlTitle: string) {
    return (
      <a
        href={href}
        className="text-fluid-2xl underline"
        rel="noopener noreferrer"
        target="_blank"
      >
        {t(intlTitle)}
      </a>
    );
  }

  return (
    <section className="relative flex min-w-full flex-col justify-between space-y-10 pt-24 pb-24 sm:space-y-20 sm:pt-36 sm:pb-32 lg:min-h-dvh lg:pt-48">
      <ScrollIndication
        arrowPosition="down"
        intlTitle="scroll"
        positionClassName="bottom-1/12 left-1/2 -translate-x-1/2"
      />

      <div>
        <motion.span
          variants={fadeInFromTop}
          role="img"
          aria-label="Negatifplus logo"
          className="block h-22 *:h-full *:w-auto sm:h-32 lg:absolute lg:top-1/2 lg:left-1/2 lg:h-1/2 lg:-translate-1/2"
        >
          {WorkLogo}
        </motion.span>
        <motion.div variants={fadeInFromTop}>
          {isArchivedProject && (
            <Badge variant="default">{t("archived")}</Badge>
          )}
          <h3 className="text-fluid-8xl font-semibold">{title}</h3>
          <p className="text-fluid-4xl font-medium">{subtitle}</p>
        </motion.div>
      </div>
      <div>
        <div className="space-y-4 leading-normal">
          <motion.div className="sm:space-y-2" variants={fadeInFromTop}>
            <p className="text-light-grey">Technologies</p>
            <div className="space-y-2 *:flex *:flex-col sm:*:flex-row">
              {frontStack && (
                <div>
                  <p className="text-light-grey w-16">Front:</p>
                  <div className="flex gap-6">
                    {frontStack.map((technology, index) => (
                      <p key={index}>{technology}</p>
                    ))}
                  </div>
                </div>
              )}
              {backStack && (
                <div>
                  <p className="text-light-grey w-16">Back:</p>
                  <div className="flex gap-6">
                    {backStack.map((technology, index) => (
                      <p key={index}>{technology}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          <motion.div
            variants={fadeInFromTop}
            className="*:flex *:flex-col sm:space-y-2 sm:*:flex-row"
          >
            {client && (
              <div>
                <p className="text-light-grey w-16">{t("client")}:</p>
                <p>{client}</p>
              </div>
            )}
            {year && (
              <div>
                <p className="text-light-grey w-16">{t("year")}:</p>
                <p>{year}</p>
              </div>
            )}
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row"
            variants={fadeInFromTop}
          >
            <p className="text-light-grey w-16">Role:</p>
            <p>{role}</p>
          </motion.div>
        </div>
        <motion.div className="space-x-12 pt-8" variants={fadeInFromTop}>
          {linkToWebsite && anchorTag(linkToWebsite, "linkToWebsite")}
          {linkToRepository && anchorTag(linkToRepository, "linkToRepository")}
        </motion.div>
      </div>
    </section>
  );
};
