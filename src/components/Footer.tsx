import * as motion from "motion/react-client";

import { CopyrightNotice, TimeWidget } from "components";

export default function Footer() {
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

  return (
    <motion.footer
      variants={itemVariants}
      className="absolute bottom-8 left-0 right-0 z-50 mx-auto w-full max-w-[inherit]"
      // TODO: Set fixed for final website
    >
      <div className="font-roboto_mono md:text-md relative flex flex-col items-center justify-center space-y-2 text-sm font-light md:absolute md:bottom-0 md:left-12 md:right-12 md:flex-row md:items-end md:justify-between">
        <CopyrightNotice />
        <TimeWidget />
      </div>
    </motion.footer>
  );
}
