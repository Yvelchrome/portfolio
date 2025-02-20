import Image from "next/image";

import github from "assets/images/github.svg";
import linkedin from "assets/images/linkedin.svg";

import * as motion from "motion/react-client";

interface Social {
  icon: string;
  darkModeClasses: string | null;
  href: string;
  label: string;
}

export default function Socials() {
  const socials = [
    {
      icon: github as string,
      darkModeClasses:
        "dark:brightness-[104%] dark:contrast-[109%] dark:hue-rotate-[290deg] dark:invert-[100%] dark:saturate-[7500%] dark:sepia-[2%]",
      href: "https://github.com/Yvelchrome",
      label: "GitHub Profile",
    },
    {
      icon: linkedin as string,
      darkModeClasses: null,
      href: "https://www.linkedin.com/in/steven-godin/",
      label: "LinkedIn Profile",
    },
  ];

  return (
    <div className="flex gap-4">
      {socials.map(({ icon, darkModeClasses, href, label }: Social) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src={icon}
            alt=""
            width={50}
            height={50}
            className={`h-8 w-auto ${darkModeClasses}`}
          />
        </motion.a>
      ))}
    </div>
  );
}
