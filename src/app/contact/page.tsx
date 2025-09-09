import * as motion from "motion/react-client";
import { fadeInFromTop } from "lib/animationsVariants";
import { useTranslations } from "next-intl";

import { ContactForm, CustomLink } from "components";
import { Mail, Phone } from "lucide-react";

const LandingPage = () => {
  const t = useTranslations("Contact");

  const contactInfoElement = (lucideIcon: React.ReactNode, text: string) => {
    return (
      <div className="flex items-center gap-2">
        {lucideIcon}
        {text}
      </div>
    );
  };

  return (
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {contactInfoElement(
          <Mail className="size-4" />,
          "stevengodin78@gmail.com",
        )}
        {contactInfoElement(<Phone className="size-4" />, "+33 7 83 11 06 75")}
      </div>
      <ContactForm />
    </motion.div>
  );
};

export default LandingPage;
