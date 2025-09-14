import { CarouselSlide, SectionHeader } from "components";

import * as motion from "motion/react-client";

import { useTranslations } from "next-intl";

import { fadeInFromTop } from "lib/animationsVariants";

export default function SectionWorks() {
  const t = useTranslations("Carousel");

  const slidesData = [
    {
      id: 1,
      title: "Adeupa",
      subtitle: t("adeupa.subtitle"),
      role: t("adeupa.role"),
      description: t("adeupa.description"),
      linkHref: "/works/adeupa",
      client: "JCEP",
      year: "2022",
      imageAlt: t("adeupa.imageAlt"),
    },
    // {
    //   id: 2,
    //   title: "Project Two",
    //   subtitle: "E-commerce Platform",
    //   role: "Full-Stack Developer",
    //   description:
    //     "Built a comprehensive e-commerce solution with modern technologies and seamless user experience.",
    //   linkHref: "http://example.com",
    //   client: "TechCorp",
    //   year: "2023",
    // },
  ];

  return (
    <motion.div variants={fadeInFromTop}>
      <SectionHeader number={"02"} intlTitle={"works"} />

      <CarouselSlide {...slidesData[0]} />
    </motion.div>
  );
}
