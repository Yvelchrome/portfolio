import * as motion from "motion/react-client";
import { fadeInFromTop } from "lib/animationsVariants";
import { useTranslations } from "next-intl";
import { Badge } from "components/shadcn/badge";

interface WorksHeroProps {
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

export default function WorksHero({
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
}: WorksHeroProps) {
  const t = useTranslations("Works");

  function anchorTag(href: string, intlTitle: string) {
    return (
      <a
        href={href}
        className="text-2xl underline"
        rel="noopener noreferrer"
        target="_blank"
      >
        {t(intlTitle)}
      </a>
    );
  }

  return (
    <motion.div
      className="flex min-w-full flex-col justify-between pt-48 pb-32"
      initial="hidden"
      animate="visible"
      transition={{
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }}
    >
      <motion.div variants={fadeInFromTop}>
        {isArchivedProject && <Badge variant="default">{t("archived")}</Badge>}
        <h3 className="text-8xl font-semibold">{title}</h3>
        <p className="text-4xl font-medium">{subtitle}</p>
      </motion.div>
      <div>
        <div className="space-y-4">
          <motion.div className="space-y-2" variants={fadeInFromTop}>
            <p className="text-light-grey">Technologies</p>
            <div className="*:flex">
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
          <motion.div variants={fadeInFromTop} className="*:flex">
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
          <motion.div className="flex" variants={fadeInFromTop}>
            <p className="text-light-grey w-16">Role:</p>
            <p>{role}</p>
          </motion.div>
        </div>
        <motion.div className="space-x-12 pt-8" variants={fadeInFromTop}>
          {linkToWebsite && anchorTag(linkToWebsite, "linkToWebsite")}
          {linkToRepository && anchorTag(linkToRepository, "linkToRepository")}
        </motion.div>
      </div>
    </motion.div>
  );
}
