import { WorksHero, CloseButton, About } from "components";

import WorkLogo from "assets/images/works/negatifplus/NegatifplusLogo.svgr.svg";
import img1 from "assets/images/works/negatifplus/configurator_2.png";
import img2 from "assets/images/works/negatifplus/configurator_1.png";
import img3 from "assets/images/works/negatifplus/account.png";
import img4 from "assets/images/works/negatifplus/hero.png";
import img5 from "assets/images/works/negatifplus/images.png";
import img6 from "assets/images/works/negatifplus/block_1.png";
import img7 from "assets/images/works/negatifplus/block_2.png";

import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

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
    images: [img1, img2, img3, img4, img5, img6, img7],
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
