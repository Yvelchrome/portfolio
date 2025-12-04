import { WorksHero, CloseButton, About } from "components";

import WorkLogo from "assets/images/works/stentor/StentorLogo.svgr.svg";
import img1 from "assets/images/works/stentor/hero.png";
import img2 from "assets/images/works/stentor/block_1.png";
import img3 from "assets/images/works/stentor/block_2.png";
import img4 from "assets/images/works/stentor/testimonial.png";
import img5 from "assets/images/works/stentor/block_4.png";
import img6 from "assets/images/works/stentor/news.png";
import img7 from "assets/images/works/stentor/block_3.png";
import img8 from "assets/images/works/stentor/block_5.png";

import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

const LandingPage = () => {
  const t = useTranslations("Works.stentor");

  const WorksHeroProps = {
    WorkLogo: <WorkLogo />,
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
    images: [img1, img2, img3, img4, img5, img6, img7, img8],
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
