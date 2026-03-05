"use client";

import { usePathname } from "next/navigation";

import { useTranslations } from "next-intl";

import {
  AddUnorderedList,
  CustomLink,
  ResumeViewer,
  TimeWidget,
} from "components";

import Discord from "assets/images/discord.svg";
import Github from "assets/images/github.svg";
import Linkedin from "assets/images/linkedin.svg";

interface FooterProps {
  email: string | undefined;
  phone: string | undefined;
}

export const Footer = ({ email, phone }: FooterProps) => {
  const t = useTranslations("Section");

  const pathname = usePathname();
  const hiddenFooterRoutes = ["/works", "/contact"];
  const hideFooter = hiddenFooterRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (hideFooter) return null;

  return (
    <footer
      className="md:h-sm:h-175 bg-deep-blue **:text-primary-text-dark relative **:border-white"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="md:h-sm:h-175 md:h-sm:fixed right-0 bottom-0 left-0 mr-(--removed-body-scroll-bar-size)">
        <div className="md:h-sm:pt-0 container mx-auto flex h-full flex-col justify-end space-y-6 px-4 py-8 sm:px-8 lg:space-y-12">
          <a
            href={email ? `mailto:${email}` : "/contact"}
            className="group text-fluid-8xl relative self-center overflow-hidden uppercase"
          >
            {t("contact_send_email")}{" "}
            <p className="text-dark-blue! relative top-0 inline-block transition-[top]! duration-400 after:absolute after:top-full after:right-0 after:content-['email'] lg:group-hover:-top-full">
              email
            </p>
          </a>
          <div className="flex w-fit flex-wrap gap-x-24 gap-y-6 lg:gap-y-12">
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
              listClassName="text-fluid-4xl lg:space-y-6 space-y-3"
            />
            {(email || phone) && (
              <div className="space-y-6 lg:space-y-12">
                {email && (
                  <AddUnorderedList
                    intlTitle="contact_email"
                    items={[email]}
                    listClassName="text-fluid-4xl"
                  />
                )}

                {phone && (
                  <AddUnorderedList
                    intlTitle="contact_phone"
                    items={[phone]}
                    listClassName="text-fluid-4xl"
                  />
                )}
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <ResumeViewer />
            <CustomLink href={"contact"} text={t("contact")} />
          </div>

          <div className="font-roboto-mono flex w-full flex-row flex-wrap items-start justify-between gap-4 text-sm font-light">
            <div className="no-locale-animation space-y-2 text-center md:text-left">
              <p>© 2025 - Steven Godin</p>
            </div>
            <TimeWidget />
          </div>
        </div>
      </div>
    </footer>
  );
};
