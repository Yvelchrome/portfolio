import type { ReactNode } from "react";

import * as motion from "motion/react-client";

import { fadeInFromTop } from "lib/animationsVariants";
import { GitHub, LinkedIn } from "utils/DynamicImageImport";

export const Socials = () => {
  interface Social {
    icon: ReactNode;
    href: string;
    label: string;
  }

  const socials: Social[] = [
    {
      icon: <GitHub />,
      href: "https://github.com/Yvelchrome",
      label: "GitHub Profile",
    },
    {
      icon: <LinkedIn className="text-[#0A66C2]" />,
      href: "https://www.linkedin.com/in/steven-godin/",
      label: "LinkedIn Profile",
    },
  ];

  return (
    <motion.div className="flex gap-4" variants={fadeInFromTop}>
      {socials.map(({ icon, href, label }) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="no-locale-animation *:pointer-events-none *:h-auto *:w-10 *:drop-shadow-sm"
        >
          {icon}
        </motion.a>
      ))}
    </motion.div>
  );
};
