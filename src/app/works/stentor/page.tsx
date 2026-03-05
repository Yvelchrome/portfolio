import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

import { About, CloseButton, WorksHero } from "components";

import WorkLogo from "assets/images/works/stentor/StentorLogo.svg";
import Block1 from "assets/images/works/stentor/block_1.png";
import Block2 from "assets/images/works/stentor/block_2.png";
import Block3 from "assets/images/works/stentor/block_3.png";
import Block4 from "assets/images/works/stentor/block_4.png";
import Block5 from "assets/images/works/stentor/block_5.png";
import Hero from "assets/images/works/stentor/hero.png";
import News from "assets/images/works/stentor/news.png";
import Testimonial from "assets/images/works/stentor/testimonial.png";
const worksAboutImagesOrdered = [
  Hero,
  Block1,
  Block2,
  Testimonial,
  Block4,
  News,
  Block3,
  Block5,
];

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
