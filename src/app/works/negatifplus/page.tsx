import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

import { About, CloseButton, WorksHero } from "components";

import WorkLogo from "assets/images/works/negatifplus/NegatifplusLogo.svg";
import Account from "assets/images/works/negatifplus/account.png";
import Block1 from "assets/images/works/negatifplus/block_1.png";
import Block2 from "assets/images/works/negatifplus/block_2.png";
import Configurator_1 from "assets/images/works/negatifplus/configurator_1.png";
import Configurator_2 from "assets/images/works/negatifplus/configurator_2.png";
import Hero from "assets/images/works/negatifplus/hero.png";
import Images from "assets/images/works/negatifplus/images.png";

const worksAboutImagesOrdered = [
  Configurator_1,
  Configurator_2,
  Account,
  Hero,
  Images,
  Block1,
  Block2,
];

const LandingPage = () => {
  const t = useTranslations("Works.negatifplus");

  const WorksHeroProps = {
    WorkLogo: <WorkLogo />,
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
