"use client";

import * as motion from "motion/react-client";
import { useMotionValue, useTransform, useSpring, animate } from "motion/react";

import { useEffect } from "react";

import { useMediaQuery } from "lib/hooks/useMediaQuery";
import { useMounted } from "lib/hooks/useMounted";

export const CustomCursor = () => {
  const cursorSize = 15;
  const hoveringClickable = useMotionValue(0);

  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothMouse = {
    x: useSpring(mouse.x, smoothOptions),
    y: useSpring(mouse.y, smoothOptions),
  };

  const scale = useTransform(hoveringClickable, [0, 1], [1, 2.5]);

  const manageMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    mouse.x.set(clientX - cursorSize / 2);
    mouse.y.set(clientY - cursorSize / 2);
  };

  const handleMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, a")) {
      animate(hoveringClickable, 1, {
        type: "spring",
        stiffness: 300,
        damping: 20,
      });
    }
  };

  const handleMouseOut = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, a")) {
      animate(hoveringClickable, 0, {
        type: "spring",
        stiffness: 300,
        damping: 20,
      });
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", manageMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", manageMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  const isMounted = useMounted();
  const hasFinePointer = useMediaQuery("(pointer: fine)");
  if (!isMounted || !hasFinePointer) return;

  return (
    <motion.div
      style={{
        left: smoothMouse.x,
        top: smoothMouse.y,
        scale,
      }}
      className="pointer-events-none fixed z-50 h-4 w-4 items-center justify-center rounded-full bg-white mix-blend-difference will-change-transform"
    >
      {hoveringClickable && (
        <motion.span
          style={{ opacity: hoveringClickable }}
          className="text-primary-text-dark absolute top-full left-full text-xs mix-blend-difference"
        >
          Click
        </motion.span>
      )}
    </motion.div>
  );
};
