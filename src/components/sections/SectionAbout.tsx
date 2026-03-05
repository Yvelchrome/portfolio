import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

import { SectionHeader } from "components";
import { fadeInFromBottom } from "lib/animationsVariants";

export const SectionAbout = () => {
  const t = useTranslations("Section");

  return (
    <motion.div variants={fadeInFromBottom} className="bg-background pb-12">
      <SectionHeader number={"01"} intlTitle={"about"} />
      <div className="font-satoshi text-fluid-4xl space-y-6 px-4 sm:px-8 md:w-10/12 xl:w-8/12">
        <p>{t("about_paragraph_1")}</p>
        <p>{t("about_paragraph_2")}</p>
      </div>
    </motion.div>
  );
};
