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
    <section className="md:h-xs:flex-row md:h-xs:space-x-8 relative flex min-w-full flex-col justify-between py-4 *:py-4">
      <motion.div
        variants={fadeInFromTop}
        className="bg-background h-xs:sticky md:h-xs:w-4/8 xl:h-xs:w-3/8 relative h-full w-full items-center space-y-2 sm:space-y-4 md:space-y-6"
        style={{ top: headerHeight }}
      >
        <h4 className="text-fluid-4xl font-semibold">{t("about_title")}</h4>
        <p className="text-fluid-2xl">{paragraph}</p>
      </motion.div>
      <div className="md:h-xs:w-4/8 xl:h-xs:w-5/8 w-full space-y-6">
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
