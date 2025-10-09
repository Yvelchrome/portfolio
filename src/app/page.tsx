import * as motion from "motion/react-client";
import { fadeInFromTop } from "lib/animationsVariants";
import { useTranslations } from "next-intl";

import {
  Socials,
  Hero,
  CustomLink,
  ResumeViewer,
  SectionAbout,
  SectionSkills,
  SectionContact,
  SectionWorks,
  ScrollIndication,
} from "components";

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

      <SectionAbout />
      <SectionWorks />
      <SectionSkills />
      <SectionContact />
    </motion.div>
  );
};

export default LandingPage;
