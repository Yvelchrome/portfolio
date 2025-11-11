import { WorksHero, CloseButton, About } from "components";

import WorkLogo from "assets/images/works/blockfire/BlockfireLogo.svgr.svg";
import img1 from "assets/images/works/blockfire/hero.png";
import img2 from "assets/images/works/blockfire/carousel.png";
import img3 from "assets/images/works/blockfire/product.png";
import img4 from "assets/images/works/blockfire/contact.png";
import img5 from "assets/images/works/blockfire/testimonial.png";
import img6 from "assets/images/works/blockfire/tabs.png";
import img7 from "assets/images/works/blockfire/articles.png";
import img8 from "assets/images/works/blockfire/faq_1.png";
import img9 from "assets/images/works/blockfire/faq_2.png";

import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

const LandingPage = () => {
  const t = useTranslations("Works.blockfire");

  const WorksHeroProps = {
    WorkLogo: <WorkLogo />,
    title: t("title"),
    subtitle: t("subtitle"),
    role: t("role"),
    frontStack: ["JavaScript", "SCSS"],
    backStack: ["WordPress", "PHP", "MySQL"],
    client: "Block'Fire",
    year: "2023",
    linkToWebsite: "https://www.blockfire.fr/",
  };
  const WorksAboutProps = {
    paragraph: t("about_paragraph_1"),
    mainColor: "#9A1918",
    images: [img1, img2, img3, img4, img5, img6, img7, img8, img9],
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
