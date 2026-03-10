import * as motion from "motion/react-client";

import { LocaleSwitcher, Logo, ThemeToggle } from "components";

export const Header = () => {
  return (
    <motion.header
      initial={{ y: "-100%" }}
      animate={{
        y: 0,
        transition: {
          duration: 0.6,
          ease: "easeOut",
        },
      }}
      className="bg-background fixed top-0 right-0 left-0 z-50 mr-(--removed-body-scroll-bar-size) border-b py-4"
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
