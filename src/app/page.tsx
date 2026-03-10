"use client";

import { useRef } from "react";

import { useScroll, useTransform } from "motion/react";
import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

import {
  CustomLink,
  Hero,
  ResumeViewer,
  ScrollIndication,
  SectionAbout,
  SectionSkills,
  SectionWorks,
  Socials,
} from "components";
import { useMounted } from "hooks/useMounted";
import { fadeInFromTop } from "lib/animationsVariants";
import { getHeaderHeight, useBreakpoint } from "utils";

const StickySectionAnimation = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isMounted = useMounted();
  const { matchesWidth, matchesHeight } = useBreakpoint();
  const shouldAnimate =
    isMounted && matchesWidth("xl") && matchesHeight("h-xl");

  const ref = useRef<HTMLDivElement | null>(null);
  const headerHeight = getHeaderHeight();

  const { scrollYProgress } = useScroll({
    target: ref,
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    offset: [`start ${headerHeight}px`, "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.9, 0.91], [1, 0.6, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const style = shouldAnimate
    ? { opacity, scale, y, willChange: "opacity, transform" }
    : { opacity: 1, scale: 1, y: 0 };

  return (
    <motion.section ref={ref} style={style}>
      {children}
    </motion.section>
  );
};

const LandingPage = () => {
  const t = useTranslations("Homepage");

  return (
    <>
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{
          staggerChildren: 0.1,
          delayChildren: 0.2,
        }}
        className="relative flex min-h-dvh flex-col items-center justify-center gap-4 py-24 sm:gap-6 md:gap-8"
      >
        <Hero />
        <motion.div className="flex gap-4" variants={fadeInFromTop}>
          <ResumeViewer />
          <CustomLink href={"contact"} text={t("contact")} />
        </motion.div>
        <Socials />
        <ScrollIndication
          arrowPosition="down"
          intlTitle="discover"
          positionClassName="bottom-1/16 left-1/2 -translate-x-1/2"
        />
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{
          staggerChildren: 0.2,
          delayChildren: 0.3,
        }}
      >
        <StickySectionAnimation>
          <SectionAbout />
        </StickySectionAnimation>

        <StickySectionAnimation>
          <SectionWorks />
        </StickySectionAnimation>

        <SectionSkills />
      </motion.section>
    </>
  );
};

export default LandingPage;
