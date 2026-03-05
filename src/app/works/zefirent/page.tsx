import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

import { About, CloseButton, WorksHero } from "components";

import WorkLogo from "assets/images/works/zefirent/ZefirentLogo.svg";
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
  Cards,
  Group,
  Map1,
  Map2,
  Tabs,
  Video,
  Block1,
  Block2,
  FaQ,
  Contact,
  Blog,
];

const LandingPage = () => {
  const t = useTranslations("Works.zefirent");

  const WorksHeroProps = {
    WorkLogo: <WorkLogo />,
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
  );
};

export default LandingPage;
