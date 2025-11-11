"use client";

import * as motion from "motion/react-client";
import { useScroll, useTransform } from "motion/react";
import { fadeInFromTop } from "lib/animationsVariants";

import { useTranslations } from "next-intl";

interface ScrollIndicationProps {
  arrowPosition: "down" | "right";
  intlTitle: "scroll" | "discover";
  positionClassName?: string;
}

export const ScrollIndication = ({
  arrowPosition,
  intlTitle,
  positionClassName,
}: ScrollIndicationProps) => {
  const t = useTranslations("UI.ScrollIndication");

  const map = {
    down: {
      flexDirection: "flex-col space-y-2",
      rotate: "none",
      svgDimensions: { width: 7, height: 30 },
    },
    right: {
      flexDirection: "flex-row space-x-2",
      rotate: "rotate(-90deg)",
      svgDimensions: { width: 30, height: 7 },
    },
  };

  const { flexDirection, rotate, svgDimensions } = map[arrowPosition];

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <motion.div
      className={`absolute ${flexDirection} ${positionClassName} lg:h-md:flex hidden items-center justify-center`}
      variants={fadeInFromTop}
      style={{ opacity }}
    >
      <p className="font-roxboroughcf text-sm uppercase">{t(intlTitle)}</p>

      <div
        className={`flex items-center justify-center *:stroke-red-600`}
        style={{ width: svgDimensions.width, height: svgDimensions.height }}
      >
        <svg
          width="7"
          height="30"
          viewBox="0 0 7 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: rotate,
            transformOrigin: "center",
          }}
          className="*:stroke-black dark:*:stroke-white"
        >
          <line x1="3.5" x2="3.5" y2="30" />
          <line x1="3.49938" y1="29.7094" x2="6.40557" y2="25.6407" />
          <line
            y1="-0.5"
            x2="5"
            y2="-0.5"
            transform="matrix(-0.581238 -0.813733 -0.813733 0.581238 2.90625 30)"
          />
        </svg>
      </div>
    </motion.div>
  );
};
