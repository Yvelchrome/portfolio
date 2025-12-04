import * as motion from "motion/react-client";
import { fadeInFromBottom } from "lib/animationsVariants";

import { SectionHeader } from "components";
import { useTranslations } from "next-intl";

export const SectionAbout = () => {
  const t = useTranslations("Section");

  return (
    <motion.div variants={fadeInFromBottom} className="bg-background pb-12">
      <SectionHeader number={"01"} intlTitle={"about"} />
      <div className="font-satoshi text-fluid-4xl space-y-6 px-4 sm:px-8 md:w-3/5">
        <p>{t("about_paragraph_1")}</p>
        <p>{t("about_paragraph_2")}</p>
      </div>
    </motion.div>
  );
};
