import * as motion from "motion/react-client";
import { fadeInFromTop } from "lib/animationsVariants";
import { useTranslations } from "next-intl";

import { ContactForm, CustomLink } from "components";
import { Mail, Phone } from "lucide-react";
import { getContactInfo } from "utils";

const LandingPage = () => {
  const t = useTranslations("Contact");
  const { email, phone } = getContactInfo();

  return (
    <div className="flex min-h-dvh w-full items-center justify-center pt-28 pb-8">
      <motion.div
        className="space-y-8"
        variants={fadeInFromTop}
        initial="hidden"
        animate="visible"
      >
        <CustomLink href="/" text={t("go_back")} arrowPosition="left" />
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        {(email || phone) && (
          <div className="grid grid-cols-1 gap-6 *:flex *:items-center *:gap-2 md:grid-cols-2">
            {email && (
              <div>
                <Mail className="size-4" />
                <p className="no-locale-animation">{email}</p>
              </div>
            )}
            {phone && (
              <div>
                <Phone className="size-4" />
                <p className="no-locale-animation">{phone}</p>
              </div>
            )}
          </div>
        )}

        <ContactForm />
      </motion.div>
    </div>
  );
};

export default LandingPage;
