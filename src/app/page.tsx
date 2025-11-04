"use client";

import { useRef } from "react";

import * as motion from "motion/react-client";
import { useScroll, useTransform } from "motion/react";

import { fadeInFromTop } from "lib/animationsVariants";
import { getHeaderHeight } from "utils";

import { useTranslations } from "next-intl";

import {
  Socials,
  Hero,
  CustomLink,
  ResumeViewer,
  SectionAbout,
  SectionSkills,
  SectionWorks,
  ScrollIndication,
} from "components";

const StickySectionAnimation = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const headerHeight = getHeaderHeight();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`start ${headerHeight}px`, "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.9, 0.91], [1, 0.6, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <motion.section
        ref={ref}
        style={{
          opacity,
          scale,
          y,
          willChange: "opacity, transform",
        }}
      >
        {children}
      </motion.section>
    </>
  );
};

const LandingPage = () => {
  const t = useTranslations("Homepage");

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }}
    >
      <motion.div className="relative flex min-h-screen flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8">
        <Hero />
        <motion.div className="flex gap-3 md:gap-4" variants={fadeInFromTop}>
          <ResumeViewer />
          <CustomLink href={"contact"} text={t("contact")} />
        </motion.div>
        <Socials />
        <ScrollIndication
          arrowPosition="down"
          intlTitle="discover"
          positionClassName="bottom-12 left-1/2 -translate-x-1/2"
        />
      </motion.div>

      <StickySectionAnimation>
        <SectionAbout />
      </StickySectionAnimation>

      <StickySectionAnimation>
        <SectionWorks />
      </StickySectionAnimation>

      <SectionSkills />
    </motion.div>
  );
};

export default LandingPage;
