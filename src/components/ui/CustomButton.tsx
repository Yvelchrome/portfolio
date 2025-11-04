import * as motion from "motion/react-client";

const CustomButton = ({
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
  const arrowElement = () => {
    return (
      <motion.span
        initial={{ x: 0, y: 0, rotate: arrowRotationDegree }}
        animate={{ x: arrowPosition === "left" ? -2 : 2, y: yAnimate ? -2 : 0 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.5,
        }}
      >
        {arrowPosition === "left" ? "←" : "→"}
      </motion.span>
    );
  };

  return (
    <motion.a href={href}>
      <motion.div
        className="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full border border-black px-4 py-1 *:text-xs *:font-medium *:md:text-base dark:border-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {arrowPosition === "left" ? (
          <>
            {arrowElement()}
            <span>{text}</span>
          </>
        ) : (
          <>
            <span>{text}</span>
            {arrowElement()}
          </>
        )}
      </motion.div>
    </motion.a>
  );
};

export default CustomButton;
