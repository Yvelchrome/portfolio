import * as motion from "motion/react-client";
import { useTranslations } from "next-intl";

export default function CopyrightNotice() {
  const t = useTranslations("Homepage");

  return (
    <motion.div
      className="space-y-2"
      whileInView={{
        y: [0, -4, 0],
        transition: {
          delay: 0.6,
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <p className="font-light">
        <span>🚧</span> {t("footer_construction")}
      </p>
      <p className="font-light">© 2025 - Steven Godin</p>
    </motion.div>
  );
}
