import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

import {
  Socials,
  Hero,
  CustomLink,
  ResumeViewer,
  SectionAbout,
  SectionSkills,
  SectionContact,
} from "components";

const LandingPage = () => {
  const t = useTranslations("Homepage");

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div>
      <motion.div
        className="flex min-h-screen flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8"
        variants={itemVariants}
      >
        <Hero />
        <div className="flex gap-3 md:gap-4">
          <ResumeViewer />
          <CustomLink href={"contact"} text={t("contact")} />
        </div>
        <Socials />
      </motion.div>

      <SectionAbout />
      <SectionSkills />
      <SectionContact />
    </div>
  );
};

export default LandingPage;
