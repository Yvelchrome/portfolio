import type { Metadata } from "next";

import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { About, CloseButton, WorksHero } from "components";
import { JsonLdScript, getBaseUrl } from "utils";
import { Zefirent } from "utils/DynamicImageImport";

import Block1 from "assets/images/works/zefirent/block_1.png";
import Block2 from "assets/images/works/zefirent/block_2.png";
import Blog from "assets/images/works/zefirent/blog.png";
import Cards from "assets/images/works/zefirent/cards.png";
import Contact from "assets/images/works/zefirent/contact.png";
import FaQ from "assets/images/works/zefirent/faq.png";
import Group from "assets/images/works/zefirent/group.png";
import Map1 from "assets/images/works/zefirent/map_1.png";
import Map2 from "assets/images/works/zefirent/map_2.png";
import Tabs from "assets/images/works/zefirent/tabs.png";
import Video from "assets/images/works/zefirent/video.png";

const worksAboutImagesOrdered = [
  { src: Cards, id: "cards" },
  { src: Group, id: "group" },
  { src: Map1, id: "map1" },
  { src: Map2, id: "map2" },
  { src: Tabs, id: "tabs" },
  { src: Video, id: "video" },
  { src: Block1, id: "block1" },
  { src: Block2, id: "block2" },
  { src: FaQ, id: "faq" },
  { src: Contact, id: "contact" },
  { src: Blog, id: "blog" },
];

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Works.zefirent");

  const BASE_URL = getBaseUrl();
  const PROJECT_URL = `${BASE_URL}/works/zefirent`;

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
  const t = useTranslations("Works.zefirent");

  const WorksHeroProps = {
    WorkLogo: <Zefirent />,
    title: t("title"),
    subtitle: t("subtitle"),
    role: t("role"),
    frontStack: ["JavaScript", "SCSS"],
    backStack: ["Drupal", "PHP", "MySQL"],
    client: "Petit Forestier - Zefirent",
    year: "2024",
    linkToWebsite: "https://zefirent.com",
  };
  const WorksAboutProps = {
    paragraph: t("about_paragraph"),
    mainColor: "#E1251B",
    images: worksAboutImagesOrdered,
  };

  return (
    <>
      <JsonLdScript schemas={["zefirentJsonLd"]} />
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
