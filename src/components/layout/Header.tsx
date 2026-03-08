import * as motion from "motion/react-client";

import { LocaleSwitcher, Logo, ThemeToggle } from "components";
import { fadeInFromTop } from "lib/animationsVariants";

export const Header = () => {
  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={fadeInFromTop}
      className="bg-background fixed top-0 right-0 left-0 z-50 border-b py-4 mr-(--removed-body-scroll-bar-size)"
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-8">
        <Logo />
        <div className="flex w-full max-w-40 items-center gap-2 sm:max-w-56 md:absolute md:left-1/2 md:max-w-sm md:-translate-x-1/2">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </div>
    </motion.header>
  );
};
