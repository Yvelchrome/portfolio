import * as motion from "motion/react-client";

import { Logo, SiteParameters } from "components";

export default function Header() {
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
    <motion.header
      variants={itemVariants}
      className="absolute left-0 right-0 top-8 z-50 mx-auto w-full max-w-[inherit]"
      // TODO: Set fixed for final website
    >
      <div className="absolute left-8 right-8 top-0 flex items-center justify-between md:left-12 md:right-12">
        <Logo />
        <SiteParameters />
      </div>
    </motion.header>
  );
}
