import Image, { type StaticImageData } from "next/image";

import * as motion from "motion/react-client";
import { fadeInFromTop } from "lib/animationsVariants";

import { useTranslations } from "next-intl";
import { getHeaderHeight } from "utils";

interface WorksAboutProps {
  paragraph: string;
  mainColor: string;
  images: Array<StaticImageData>;
}

export const About = ({ paragraph, mainColor, images }: WorksAboutProps) => {
  const headerHeight = getHeaderHeight();

  const t = useTranslations("Works");

  return (
    <section className="relative flex min-w-full flex-col justify-between py-4 *:py-4 lg:flex-row">
      <motion.div
        variants={fadeInFromTop}
        className="bg-background sticky h-full w-full items-center space-y-2 sm:space-y-4 lg:w-3/8 lg:space-y-6"
        style={{ top: headerHeight }}
      >
        <h4 className="text-fluid-5xl font-semibold">{t("about_title")}</h4>
        <div className="text-fluid-4xl space-y-6 leading-tight">
          <p>{paragraph}</p>
        </div>
      </motion.div>
      <div className="w-full space-y-6 lg:w-4/8">
        {images.map((image, index) => (
          <motion.div
            variants={fadeInFromTop}
            key={index}
            style={{ backgroundColor: mainColor }}
            className="px-4 py-2 sm:px-12 sm:py-6 lg:px-16 lg:py-8"
          >
            <Image
              src={image}
              alt={`negatifplus image ${index + 1}`}
              className="aspect-16/10 object-cover"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
