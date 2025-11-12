import * as motion from "motion/react-client";

export const CustomButton = ({
  href,
  text,
  arrowRotationDegree,
  arrowPosition,
  yAnimate,
}: {
  href?: string;
  text: string;
  arrowRotationDegree?: number;
  arrowPosition?: "left" | "right";
  yAnimate?: boolean;
}) => {
  const isLeft = arrowPosition === "left";
  const x = isLeft ? -2 : 2;
  const y = yAnimate ? -2 : 0;

  const Arrow = (
    <motion.span
      initial={{ x: 0, y: 0, rotate: arrowRotationDegree }}
      animate={{ x, y }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 0.5,
      }}
      className="no-locale-animation"
    >
      {isLeft ? "←" : "→"}
    </motion.span>
  );

  return (
    <motion.a href={href} className="no-locale-animation">
      <motion.div
        className={`flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full border border-black px-4 py-1 *:text-xs *:font-medium *:md:text-base dark:border-white ${
          isLeft ? "flex-row-reverse" : ""
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <span>{text}</span>
        {Arrow}
      </motion.div>
    </motion.a>
  );
};
