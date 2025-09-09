import Github from "assets/images/github.svgr.svg";
import Linkedin from "assets/images/linkedin.svgr.svg";
import Discord from "assets/images/discord.svgr.svg";

import * as motion from "motion/react-client";
import { fadeInFromTop } from "lib/animationsVariants";

import { AddUnorderedList, SectionHeader } from "components";
import { useTranslations } from "next-intl";

export default function SectionContact() {
  const t = useTranslations("Section");

  return (
    <motion.div variants={fadeInFromTop}>
      <SectionHeader number={"03"} intlTitle={"contact"} />
      <h3 className="pb-12 text-center text-7xl">{t("contact_send_email")}</h3>
      <div className="font-satoshi flex gap-24 px-8">
        <AddUnorderedList
          intlTitle="contact_socials"
          items={[
            {
              text: "Yvelchrome",
              icon: <Github />,
              iconAlt: "GitHub : ",
            },
            {
              text: "Steven Godin",
              icon: <Linkedin />,
              iconAlt: "LinkedIn : ",
            },
            {
              text: "@yvelchrome",
              icon: <Discord />,
              iconAlt: "Discord : ",
            },
          ]}
          listClassName="text-3xl space-y-7"
        />
        <div className="space-y-12">
          <AddUnorderedList
            intlTitle="contact_email"
            items={["stevengodin78@gmail.com"]}
            listClassName="text-3xl"
          />
          <AddUnorderedList
            intlTitle="contact_phone"
            items={["+33 7 83 11 06 75"]}
            listClassName="text-3xl"
          />
        </div>
      </div>
    </motion.div>
  );
}
