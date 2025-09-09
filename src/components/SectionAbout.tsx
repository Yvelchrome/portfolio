import * as motion from "motion/react-client";
import { fadeInFromTop } from "lib/animationsVariants";

import { SectionHeader } from "components";
import { useTranslations } from "next-intl";

export default function SectionAbout() {
  const t = useTranslations("Section");

  return (
    <motion.div variants={fadeInFromTop}>
      <SectionHeader number={"01"} intlTitle={"about"} />
      <div className="font-satoshi space-y-6 px-8 text-4xl leading-tight">
        <p>{t("about_paragraph_1")}</p>
        <p>{t("about_paragraph_2")}</p>
        <p>{t("about_paragraph_3")}</p>
      </div>
    </motion.div>
  );
}
