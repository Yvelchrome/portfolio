import {
  HorizontalScrollWrapper,
  WorksHero,
  CloseButton,
  ScrollIndication,
  About,
} from "components";

import AdeupaLogo from "assets/images/works/adeupa/AdeupaLogo.svgr.svg";

import { useTranslations } from "next-intl";

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
    isArchivedProject: true,
  };
  const WorksAboutProps = {
    paragraphs: [
      t("about_paragraph_1"),
      t("about_paragraph_2"),
      t("about_paragraph_3"),
    ],
  };

  return (
    <>
      <HorizontalScrollWrapper>
        <ScrollIndication
          arrowPosition="right"
          intlTitle="scroll"
          positionClassName="top-1/2 right-1/8 -translate-y-1/2"
        />
        <span
          role="img"
          aria-label="Adeupa logo"
          className="absolute top-1/2 left-1/2 flex h-1/2 -translate-1/2 items-center justify-center *:absolute *:h-full *:w-auto"
        >
          <AdeupaLogo />
          <AdeupaLogo className="animate-ring origin-center *:fill-transparent *:stroke-[#F77676] *:stroke-[1]" />
        </span>

        {/* <WorksHero {...WorksHeroProps} />
        <About {...WorksAboutProps} /> */}
      </HorizontalScrollWrapper>
      <CloseButton />
    </>
  );
};

export default LandingPage;
