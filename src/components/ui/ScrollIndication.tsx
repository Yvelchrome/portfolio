"use client";

import { useScroll, useSpring, useTransform } from "motion/react";
import * as motion from "motion/react-client";
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
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const opacity = useSpring(scrollOpacity);

  return (
    <motion.div
      className={`absolute ${flexDirection} ${String(positionClassName)} lg:h-md:flex hidden items-center justify-center`}
      style={{ opacity }}
    >
      <p className="font-roxboroughcf text-primary-text text-sm uppercase">
        {t(intlTitle)}
      </p>

      <div
        className={`flex items-center justify-center`}
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
          className="stroke-primary-text"
        >
          <path d="M3.5 0v30m-.001-.291 2.907-4.068m-3.093 4.068L.407 25.64" />
        </svg>
      </div>
    </motion.div>
  );
};
