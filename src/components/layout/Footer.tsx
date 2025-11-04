"use client";

import {
  CopyrightNotice,
  TimeWidget,
  AddUnorderedList,
  ResumeViewer,
  CustomLink,
} from "components";
import Github from "assets/images/github.svgr.svg";
import Linkedin from "assets/images/linkedin.svgr.svg";
import Discord from "assets/images/discord.svgr.svg";

import { usePathname } from "next/navigation";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Section");

  const pathname = usePathname();
  const hiddenFooterRoutes = ["/works", "/contact"];
  const hideFooter = hiddenFooterRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (hideFooter) return null;

  return (
    <footer
      className="bg-light-grey relative h-screen sm:h-[700px]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed right-0 bottom-0 left-0 mr-[var(--removed-body-scroll-bar-size)] h-screen sm:h-[700px]">
        <div className="container mx-auto flex h-full flex-col justify-end space-y-12 px-8 pb-8">
          <a
            href="mailto:stevengodin78@gmail.com"
            className="group text-fluid-8xl relative left-1/2 w-fit -translate-x-1/2 uppercase"
          >
            {t("contact_send_email")}{" "}
            <div className="text-dark-blue font-roxboroughcf relative top-0 inline-grid overflow-hidden *:!transition-[top] *:duration-400">
              <p className="relative top-0 group-hover:-top-full">email</p>
              <span className="absolute top-[110%] left-0 group-hover:-top-0">
                email
              </span>
            </div>
          </a>
          <div className="flex w-fit flex-wrap gap-x-24 gap-y-12">
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
              listClassName="text-fluid-4xl space-y-7"
            />
            <div className="space-y-12">
              <AddUnorderedList
                intlTitle="contact_email"
                items={["stevengodin78@gmail.com"]}
                listClassName="text-fluid-4xl"
              />
              <AddUnorderedList
                intlTitle="contact_phone"
                items={["+33 7 83 11 06 75"]}
                listClassName="text-fluid-4xl"
              />
            </div>
          </div>
          <div className="flex gap-3 md:gap-4">
            <ResumeViewer />
            <CustomLink href={"contact"} text={t("contact")} />
          </div>

          <div className="font-roboto-mono md:text-md flex w-full flex-col items-center justify-center space-y-2 text-sm font-light md:flex-row md:justify-between md:space-y-0">
            <CopyrightNotice />
            <TimeWidget />
          </div>
        </div>
      </div>
    </footer>
  );
}
