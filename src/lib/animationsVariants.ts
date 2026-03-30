import type { Variants } from "motion/react";

export const fadeInFromTop: Variants = {
  hidden: { opacity: 0.01, translateY: -20 },
  visible: {
    opacity: 1,
    translateY: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const fadeInFromBottom: Variants = {
  hidden: { opacity: 0.01, translateY: 20 },
  visible: {
    opacity: 1,
    translateY: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};
