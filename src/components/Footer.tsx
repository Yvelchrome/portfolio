import * as motion from "motion/react-client";
import { fadeInFromBottom } from "lib/animationsVariants";

import { CopyrightNotice, TimeWidget } from "components";

export default function Footer() {
  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={fadeInFromBottom}
      className="fixed right-0 bottom-8 left-0 z-50 mx-auto w-full max-w-[inherit]"
    >
      <div className="font-roboto_mono md:text-md relative flex flex-col items-center justify-center space-y-2 text-sm font-light md:absolute md:right-12 md:bottom-0 md:left-12 md:flex-row md:items-end md:justify-between">
        <CopyrightNotice />
        <TimeWidget />
      </div>
    </motion.footer>
  );
}
