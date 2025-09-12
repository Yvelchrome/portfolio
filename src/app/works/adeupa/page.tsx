import { useTranslations } from "next-intl";
import { WorksHero } from "components";

const LandingPage = () => {
  const t = useTranslations("Works.adeupa");

  const WorksHeroProps = {
    title: t("title"),
    subtitle: t("subtitle"),
    role: t.rich("role", {
      br: () => <br />,
    }) as string,
    frontStack: ["React", "TypeScript", "SCSS"],
    backStack: ["Node.js", "Prisma", "Fastify", "MySQL"],
    client: "JCEP",
    year: "2022",
    linkToRepository: "https://github.com/arthur-fontaine/adeupa",
  };

  return <WorksHero {...WorksHeroProps} />;
};

export default LandingPage;
