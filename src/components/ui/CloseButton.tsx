import Link from "next/link";
import * as motion from "motion/react-client";
import { XIcon } from "lucide-react";

export const CloseButton = () => {
  return (
    <Link href={"/"} className="no-locale-animation">
      <motion.div
        className="text-primary-text-light fixed bottom-12 left-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-[#D9D9D9] p-4"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <XIcon />
      </motion.div>
    </Link>
  );
};
