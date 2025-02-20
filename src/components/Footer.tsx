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
      <div className="absolute bottom-0 left-8 right-8 flex items-end justify-between md:left-12 md:right-12">
        <CopyrightNotice />
        <TimeWidget />
      </div>
    </motion.footer>
  );
}
