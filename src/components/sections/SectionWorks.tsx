import { SectionWorksItem, SectionHeader } from "components";

import NegatifplusLogo from "assets/images/works/negatifplus/NegatifplusLogo.svgr.svg";
import BlockfireLogo from "assets/images/works/blockfire/BlockfireLogo.svgr.svg";
import ZefirentLogo from "assets/images/works/zefirent/ZefirentLogo.svgr.svg";
import StentorLogo from "assets/images/works/stentor/StentorLogo.svgr.svg";

import * as motion from "motion/react-client";
import { fadeInFromBottom } from "lib/animationsVariants";

import { useTranslations } from "next-intl";

export const SectionWorks = () => {
  const t = useTranslations("Section.WorksItem");

  const itemData = [
    {
      id: 1,
      title: "Négatif+",
      subtitle: t("subtitle.e-commerce"),
      role: t("role.frontend_developer"),
      description: t("description.negatifplus"),
      linkHref: "/works/negatifplus",
      client: "Négatif+",
      year: "2024",
      brandLogo: <NegatifplusLogo />,
      brandLogoAlt: "Négatif+ logo",
    },
    {
      id: 2,
      title: "Zefirent",
      subtitle: t("subtitle.vehicle_rental"),
      role: t("role.frontend_developer"),
      description: t("description.zefirent"),
      linkHref: "/works/zefirent",
      client: "Petit Forestier - Zefirent",
      year: "2024",
      brandLogo: <ZefirentLogo />,
      brandLogoAlt: "Zefirent logo",
    },
    {
      id: 3,
      title: "Block'Fire",
      subtitle: t("subtitle.e-commerce"),
      role: t("role.frontend_developer"),
      description: t("description.blockfire"),
      linkHref: "/works/blockfire",
      client: "Block'Fire",
      year: "2023",
      brandLogo: <BlockfireLogo />,
      brandLogoAlt: "Block'Fire logo",
    },
    {
      id: 4,
      title: "Groupe Stentor",
      subtitle: t("subtitle.services"),
      role: t("role.frontend_developer"),
      description: t("description.stentor"),
      linkHref: "/works/stentor",
      client: "Groupe Stentor",
      year: "2022",
      brandLogo: <StentorLogo />,
      brandLogoAlt: "Groupe Stentor logo",
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
