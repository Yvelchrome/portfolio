import { WorksHero, CloseButton, About } from "components";

import WorkLogo from "assets/images/works/zefirent/ZefirentLogo.svgr.svg";
import img1 from "assets/images/works/zefirent/cards.png";
import img2 from "assets/images/works/zefirent/group.png";
import img3 from "assets/images/works/zefirent/map_1.png";
import img4 from "assets/images/works/zefirent/map_2.png";
import img5 from "assets/images/works/zefirent/tabs.png";
import img6 from "assets/images/works/zefirent/video.png";
import img7 from "assets/images/works/zefirent/block_1.png";
import img8 from "assets/images/works/zefirent/block_2.png";
import img9 from "assets/images/works/zefirent/faq.png";
import img10 from "assets/images/works/zefirent/blog.png";
import img11 from "assets/images/works/zefirent/contact.png";

import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

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
    images: [
      img1,
      img2,
      img3,
      img4,
      img5,
      img6,
      img7,
      img8,
      img9,
      img10,
      img11,
    ],
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
