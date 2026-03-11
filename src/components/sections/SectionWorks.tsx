import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

import { SectionHeader, SectionWorksItem } from "components";
import { useCardGlow } from "hooks/useCardGlow";
import { fadeInFromBottom } from "lib/animationsVariants";
import {
  Blockfire,
  Negatifplus,
  Stentor,
  Zefirent,
} from "utils/DynamicImageImport";

export const SectionWorks = () => {
  const t = useTranslations("Section.WorksItem");

  const containerRef = useCardGlow();

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
      brandLogo: <Negatifplus />,
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
      brandLogo: <Zefirent />,
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
      brandLogo: <Blockfire />,
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
      brandLogo: <Stentor />,
      brandLogoAlt: "Groupe Stentor logo",
    },
  ];

  return (
    <motion.div variants={fadeInFromBottom} className="bg-background pb-12">
      <SectionHeader number={"02"} intlTitle={"works"} />

      <div
        ref={containerRef}
        className="cards-glow grid grid-cols-1 gap-4 px-4 xl:grid-cols-2"
      >
        {itemData.length > 0 &&
          itemData.map((item) => <SectionWorksItem key={item.id} {...item} />)}
      </div>
    </motion.div>
  );
};
