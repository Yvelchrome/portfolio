"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";

import {
  type MotionValue,
  SpringOptions,
  animate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import * as motion from "motion/react-client";

import { useMediaQuery } from "hooks/useMediaQuery";
import { useMounted } from "hooks/useMounted";

const smoothOptions: SpringOptions = {
  damping: 20,
  stiffness: 300,
  mass: 0.5,
};
export const BASE_CURSOR_SIZE = 16;
export const MAX_CURSOR_SIZE = 40;

export const isHoveringClickable = (target: EventTarget | null): boolean => {
  return target instanceof HTMLElement && !!target.closest("button, a");
};

const handleHoveringClickable = (
  target: EventTarget | null,
  hoveringClickable: MotionValue<number>,
  hoveringClickableValue: 0 | 1,
) => {
  if (!isHoveringClickable(target)) return;

  animate(hoveringClickable, hoveringClickableValue, smoothOptions);
};

export const CustomCursor = () => {
  const hoveringClickable = useMotionValue(0);
  const mouse = { x: useMotionValue(0), y: useMotionValue(0) };

  const smoothMouseX = useSpring(mouse.x, smoothOptions);
  const smoothMouseY = useSpring(mouse.y, smoothOptions);

  const cursorSize = useTransform(
    hoveringClickable,
    [0, 1],
    [BASE_CURSOR_SIZE, MAX_CURSOR_SIZE],
  );
  const cursorTranslate = useTransform(
    hoveringClickable,
    [0, 1],
    ["0%", "-25%"],
  );
  const fontSize = useTransform(hoveringClickable, [0, 1], ["12px", "30px"]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouse.x.set(clientX - BASE_CURSOR_SIZE / 2);
      mouse.y.set(clientY - BASE_CURSOR_SIZE / 2);
    };

    const onMouseOver = (e: MouseEvent) => {
      handleHoveringClickable(e.target, hoveringClickable, 1);
    };
    const onMouseOut = (e: MouseEvent) => {
      handleHoveringClickable(e.target, hoveringClickable, 0);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
    };
  }, [hoveringClickable, mouse.x, mouse.y]);

  const pathname = usePathname();
  useEffect(() => {
    animate(hoveringClickable, 0, smoothOptions);
  }, [pathname]);

  const isMounted = useMounted();
  const hasFinePointer = useMediaQuery("(pointer: fine)");
  if (!isMounted || !hasFinePointer) return null;

  return (
    <motion.div
      style={{
        left: smoothMouseX,
        top: smoothMouseY,
        width: cursorSize,
        height: cursorSize,
        translateX: cursorTranslate,
        translateY: cursorTranslate,
      }}
      className="pointer-events-none fixed z-50 transform-gpu items-center justify-center rounded-full bg-white mix-blend-difference will-change-transform"
      data-testid="custom-cursor"
    >
      <motion.span
        style={{ opacity: hoveringClickable, fontSize }}
        className="text-primary-text-dark absolute top-full left-full"
      >
        Click
      </motion.span>
    </motion.div>
  );
};
