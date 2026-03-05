import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

import { About, CloseButton, WorksHero } from "components";

import WorkLogo from "assets/images/works/blockfire/BlockfireLogo.svg";
import Articles from "assets/images/works/blockfire/articles.png";
import Carousel from "assets/images/works/blockfire/carousel.png";
import Contact from "assets/images/works/blockfire/contact.png";
import FaQ_1 from "assets/images/works/blockfire/faq_1.png";
import FaQ_2 from "assets/images/works/blockfire/faq_2.png";
import Hero from "assets/images/works/blockfire/hero.png";
import Product from "assets/images/works/blockfire/product.png";
import Tabs from "assets/images/works/blockfire/tabs.png";
import Testimonial from "assets/images/works/blockfire/testimonial.png";

const worksAboutImagesOrdered = [
  Hero,
  Carousel,
  Product,
  Contact,
  Testimonial,
  Tabs,
  Articles,
  FaQ_1,
  FaQ_2,
];

const LandingPage = () => {
  const t = useTranslations("Works.blockfire");

  const WorksHeroProps = {
    WorkLogo: <WorkLogo />,
    title: t("title"),
    subtitle: t("subtitle"),
    role: t("role"),
    frontStack: ["JavaScript", "SCSS", "GSAP"],
    backStack: ["WordPress", "PHP", "MySQL"],
    client: "Block'Fire",
    year: "2023",
    linkToWebsite: "https://www.blockfire.fr/",
  };
  const WorksAboutProps = {
    paragraph: t("about_paragraph"),
    mainColor: "#9A1918",
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
