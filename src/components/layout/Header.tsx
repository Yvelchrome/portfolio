import * as motion from "motion/react-client";
import { fadeInFromTop } from "lib/animationsVariants";

import { Logo, SiteParameters } from "components";

export default function Header() {
  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={fadeInFromTop}
      className="bg-background fixed top-0 right-0 left-0 z-50 mr-[var(--removed-body-scroll-bar-size)] border-b py-4"
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-8">
        <Logo />
        <SiteParameters />
      </div>
    </motion.header>
  );
}
