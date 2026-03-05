import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

import { fadeInFromTop } from "lib/animationsVariants";

export const Hero = () => {
  const t = useTranslations("Homepage");

  return (
    <motion.div
      className="space-y-1 text-center md:space-y-2"
      variants={fadeInFromTop}
    >
      <h1 className="text-fluid-9xl no-locale-animation">Steven Godin</h1>
      <p className="text-fluid-5xl">{t("job_title")}</p>
    </motion.div>
  );
};
