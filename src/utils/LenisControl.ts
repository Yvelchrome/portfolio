import { getLenis } from "components/widgets/SmoothScrolling";

export const LenisControl = {
  stop() {
    const lenis = getLenis();
    if (lenis && typeof lenis.stop === "function") {
      lenis.stop();
    }
  },
  start() {
    const lenis = getLenis();
    if (lenis && typeof lenis.start === "function") {
      lenis.start();
    }
  },
};
