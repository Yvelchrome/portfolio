import Github from "assets/images/github.svgr.svg";
import Linkedin from "assets/images/linkedin.svgr.svg";
import Discord from "assets/images/discord.svgr.svg";

import * as motion from "motion/react-client";
import { fadeInFromTop } from "lib/animationsVariants";

import Link from "next/link";
import { AddUnorderedList, SectionHeader } from "components";
import { useTranslations } from "next-intl";

export default function SectionContact() {
  const t = useTranslations("Section");

  return (
    <motion.div variants={fadeInFromTop}>
      <SectionHeader number={"03"} intlTitle={"contact"} />

      <Link
        href="/contact"
        className="group mb-12 block text-center text-8xl font-bold uppercase"
      >
        {t("contact_send_email")}{" "}
        <div className="text-dark-blue relative top-0 inline-grid overflow-hidden *:transition-all *:duration-400">
          <p className="relative top-0 group-hover:-top-full">email</p>
          <span className="absolute top-[110%] left-0 group-hover:-top-0">
            email
          </span>
        </div>
      </Link>
      <div className="font-satoshi flex gap-24 px-8">
        <AddUnorderedList
          intlTitle="contact_socials"
          items={[
            {
              text: "Yvelchrome",
              icon: <Github />,
              iconAlt: "GitHub : ",
              href: "https://github.com/Yvelchrome",
            },
            {
              text: "Steven Godin",
              icon: <Linkedin />,
              iconAlt: "LinkedIn : ",
              href: "https://www.linkedin.com/in/steven-godin/",
            },
            {
              text: "@yvelchrome",
              icon: <Discord />,
              iconAlt: "Discord : ",
              href: "https://discordapp.com/users/507676625681514501",
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
