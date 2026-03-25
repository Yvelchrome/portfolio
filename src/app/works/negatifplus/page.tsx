import type { Metadata } from "next";

import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { About, CloseButton, WorksHero } from "components";
import { JsonLdScript, getBaseUrl } from "utils";
import { Negatifplus } from "utils/DynamicImageImport";

import Account from "assets/images/works/negatifplus/account.png";
import Block1 from "assets/images/works/negatifplus/block_1.png";
import Block2 from "assets/images/works/negatifplus/block_2.png";
import Configurator_1 from "assets/images/works/negatifplus/configurator_1.png";
import Configurator_2 from "assets/images/works/negatifplus/configurator_2.png";
import Hero from "assets/images/works/negatifplus/hero.png";
import Images from "assets/images/works/negatifplus/images.png";

const worksAboutImagesOrdered = [
  { src: Configurator_1, id: "configurator-1" },
  { src: Configurator_2, id: "configurator-2" },
  { src: Account, id: "account" },
  { src: Hero, id: "hero" },
  { src: Images, id: "images" },
  { src: Block1, id: "block1" },
  { src: Block2, id: "block2" },
];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Works.negatifplus");

  const BASE_URL = getBaseUrl();
  const PROJECT_URL = `${BASE_URL}/works/negatifplus`;

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
  const t = useTranslations("Works.negatifplus");

  const WorksHeroProps = {
    WorkLogo: <Negatifplus />,
    title: t("title"),
    subtitle: t("subtitle"),
    role: t("role"),
    frontStack: ["JavaScript", "SCSS", "GSAP"],
    backStack: ["PrestaShop", "PHP", "MySQL"],
    client: "Négatif+",
    year: "2024",
    linkToWebsite: "https://www.negatifplus.com/",
  };
  const WorksAboutProps = {
    paragraph: t("about_paragraph"),
    mainColor: "#7C2900",
    images: worksAboutImagesOrdered,
  };

  return (
    <>
      <JsonLdScript schemas={["negatifplusJsonLd"]} />
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
