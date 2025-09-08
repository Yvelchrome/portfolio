import * as motion from "motion/react-client";
import { itemsVariant } from "lib/animationsVariants";

import { Logo, SiteParameters } from "components";

export default function Header() {
  return (
    <motion.header
      variants={itemsVariant}
      className="fixed top-8 right-0 left-0 z-50 mx-auto w-full max-w-[inherit]"
    >
      <div className="absolute top-0 right-8 left-8 flex items-center justify-between md:right-12 md:left-12">
        <Logo />
        <SiteParameters />
      </div>
    </motion.header>
  );
}
