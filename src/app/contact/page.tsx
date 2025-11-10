import * as motion from "motion/react-client";
import { fadeInFromTop } from "lib/animationsVariants";
import { useTranslations } from "next-intl";

import { ContactForm, CustomLink } from "components";
import { Mail, Phone } from "lucide-react";

const LandingPage = () => {
  const t = useTranslations("Contact");

  return (
    <div className="flex min-h-dvh w-full items-center justify-center">
      <motion.div
        className="space-y-8"
        variants={fadeInFromTop}
        initial="hidden"
        animate="visible"
        transition={{
          staggerChildren: 0.2,
          delayChildren: 0.3,
        }}
      >
        <CustomLink href="/" text={t("go_back")} arrowPosition="left" />
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <div className="grid grid-cols-1 gap-6 *:flex *:items-center *:gap-2 md:grid-cols-2">
          <div>
            <Mail className="size-4" />
            <p>stevengodin78@gmail.com</p>
          </div>
          <div>
            <Phone className="size-4" />
            <p>+33 7 83 11 06 75</p>
          </div>
        </div>
        <ContactForm />
      </motion.div>
    </div>
  );
};

export default LandingPage;
