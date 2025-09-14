import type { ReactNode } from "react";
import Github from "assets/images/github.svgr.svg";
import Linkedin from "assets/images/linkedin.svgr.svg";

import * as motion from "motion/react-client";
import { fadeInFromTop } from "lib/animationsVariants";

interface Social {
  icon: ReactNode;
  href: string;
  label: string;
}

export default function Socials() {
  const socials: Social[] = [
    {
      icon: <Github className="text-4xl" />,
      href: "https://github.com/Yvelchrome",
      label: "GitHub Profile",
    },
    {
      icon: <Linkedin className="text-4xl text-[#0A66C2]" />,
      href: "https://www.linkedin.com/in/steven-godin/",
      label: "LinkedIn Profile",
    },
  ];

  return (
    <motion.div className="flex gap-3 md:gap-4" variants={fadeInFromTop}>
      {socials.map(({ icon, href, label }) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {icon}
        </motion.a>
      ))}
    </motion.div>
  );
}
