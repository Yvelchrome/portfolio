import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

import { Socials, Hero, CustomLink, ResumeViewer } from "components";

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
    <motion.div
      className="flex flex-col items-center gap-8"
      variants={itemVariants}
    >
      <Hero />
      <div className="flex gap-4">
        <ResumeViewer />
        <CustomLink href={"contact"} text={t("contact")} />
      </div>
      <Socials />
    </motion.div>
  );
};

export default LandingPage;
