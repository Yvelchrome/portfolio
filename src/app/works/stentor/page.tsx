import type { Metadata } from "next";

import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { About, CloseButton, WorksHero } from "components";
import { JsonLdScript, getBaseUrl } from "utils";
import { Stentor } from "utils/DynamicImageImport";

import Block1 from "assets/images/works/stentor/block_1.png";
import Block2 from "assets/images/works/stentor/block_2.png";
import Block3 from "assets/images/works/stentor/block_3.png";
import Block4 from "assets/images/works/stentor/block_4.png";
import Block5 from "assets/images/works/stentor/block_5.png";
import Hero from "assets/images/works/stentor/hero.png";
import News from "assets/images/works/stentor/news.png";
import Testimonial from "assets/images/works/stentor/testimonial.png";

const BASE_URL = getBaseUrl();
const WORKS_URL = `${BASE_URL}/works`;
const PROJECT_URL = `${WORKS_URL}/stentor`;

const worksAboutImagesOrdered = [
  { src: Hero, id: "hero" },
  { src: Block1, id: "block1" },
  { src: Block2, id: "block2" },
  { src: Testimonial, id: "testimonial" },
  { src: Block4, id: "block4" },
  { src: News, id: "news" },
  { src: Block3, id: "block3" },
  { src: Block5, id: "block5" },
];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Works.stentor");

  return {
    title: t("title"),
    description: t("about_paragraph"),
    alternates: {
      canonical: PROJECT_URL,
      languages: {
        en: PROJECT_URL,
        fr: PROJECT_URL,
      },
    },
  };
}

const LandingPage = () => {
  const t = useTranslations("Works.stentor");

  const WorksHeroProps = {
    WorkLogo: <Stentor />,
    title: t("title"),
    subtitle: t("subtitle"),
    role: t("role"),
    frontStack: ["JavaScript", "SCSS", "GSAP"],
    backStack: ["WordPress", "PHP", "MySQL"],
    client: "Groupe Stentor",
    year: "2022",
    linkToWebsite: "https://www.groupestentor.fr/",
  };
  const WorksAboutProps = {
    paragraph: t("about_paragraph"),
    mainColor: "#004c52",
    images: worksAboutImagesOrdered,
  };

  return (
    <>
      <JsonLdScript
        schemas={["stentorJsonLd"]}
        breadcrumb={{
          items: [
            { name: "Home", url: BASE_URL },
            { name: "Works", url: WORKS_URL },
            { name: "Stentor", url: PROJECT_URL },
          ],
        }}
      />
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{
          staggerChildren: 0.1,
          delayChildren: 0.2,
        }}
        className="px-4 sm:px-8"
      >
        <WorksHero {...WorksHeroProps} />
        <About {...WorksAboutProps} />
        <CloseButton />
      </motion.div>
    </>
  );
};

export default LandingPage;
