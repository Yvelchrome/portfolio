"use client";

import { useRef, useLayoutEffect, useState, type ReactNode } from "react";
import * as motion from "motion/react-client";
import { useScroll, useTransform } from "motion/react";

export const HorizontalScrollWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const updateWidth = () => {
      setContentWidth(contentRef.current!.scrollWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [children]);

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, window.innerWidth - contentWidth],
  );

  return (
    <div ref={targetRef} style={{ height: contentWidth }}>
      <motion.div
        className="sticky top-0 flex min-h-screen will-change-transform"
        ref={contentRef}
        style={{ x }}
      >
        {children}
      </motion.div>
    </div>
  );
};
