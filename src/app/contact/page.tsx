import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

import { ContactForm, CustomLink } from "components";
import { Mail, Phone } from "lucide-react";

const LandingPage = () => {
  const t = useTranslations("Contact");

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const contactInfoElement = (lucideIcon: React.ReactNode, text: string) => {
    return (
      <div className="flex items-center gap-2">
        {lucideIcon}
        {text}
      </div>
    );
  };

  return (
    <motion.div className="space-y-8" variants={itemVariants}>
      <CustomLink href="/" text="Retour" arrowPosition="left" />
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
