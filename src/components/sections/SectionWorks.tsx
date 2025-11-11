import { SectionWorksItem, SectionHeader } from "components";

import NegatifplusLogo from "assets/images/works/negatifplus/NegatifplusLogo.svgr.svg";
import BlockfireLogo from "assets/images/works/blockfire/BlockfireLogo.svgr.svg";

import * as motion from "motion/react-client";
import { fadeInFromBottom } from "lib/animationsVariants";

import { useTranslations } from "next-intl";

export const SectionWorks = () => {
  const t = useTranslations("Section.WorksItem");

  const itemData = [
    {
      id: 1,
      title: "Négatif+",
      subtitle: t("negatifplus.subtitle"),
      role: t("role.frontend_developer"),
      description: t("negatifplus.description"),
      linkHref: "/works/negatifplus",
      client: "Négatif+",
      year: "2024",
      brandLogo: <NegatifplusLogo />,
      brandLogoAlt: t("negatifplus.brandLogoAlt"),
    },
    {
      id: 2,
      title: "Block'Fire",
      subtitle: t("blockfire.subtitle"),
      role: t("role.frontend_developer"),
      description: t("blockfire.description"),
      linkHref: "/works/blockfire",
      client: "Block'Fire",
      year: "2023",
      brandLogo: <BlockfireLogo />,
      brandLogoAlt: t("blockfire.brandLogoAlt"),
    },
  ];

  return (
    <motion.div variants={fadeInFromBottom} className="bg-background pb-12">
      <SectionHeader number={"02"} intlTitle={"works"} />

      <div className="grid grid-cols-1 gap-4 px-4 xl:grid-cols-2">
        {itemData.length > 0 &&
          itemData.map((item) => <SectionWorksItem key={item.id} {...item} />)}
      </div>
    </motion.div>
  );
};
