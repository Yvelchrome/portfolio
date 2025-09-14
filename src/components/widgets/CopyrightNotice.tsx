import * as motion from "motion/react-client";

export default function CopyrightNotice() {
  return (
    <motion.div
      className="space-y-2 text-center md:text-left"
      whileInView={{
        y: [0, -4, 0],
        transition: {
          delay: 0.6,
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <p>© 2025 - Steven Godin</p>
    </motion.div>
  );
}
