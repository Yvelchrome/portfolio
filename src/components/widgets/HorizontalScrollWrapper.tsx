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
  const [sizes, setSizes] = useState({ height: 0, width: 0, viewport: 0 });

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const updateSizes = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (!contentRef.current) return;

      let contentWidth = 0;
      Array.from(contentRef.current.children).forEach((children) => {
        if (children instanceof HTMLElement) {
          if (children.dataset.xScroll === undefined) return;

          const rect = children.getBoundingClientRect();
          contentWidth += rect.width;
        }
      });

      const totalContentWidth = Math.max(
        contentWidth,
        contentRef.current.scrollWidth,
      );

      const scrollableWidth = Math.max(0, totalContentWidth - viewportWidth);

      const scrollHeight = scrollableWidth + viewportHeight;

      setSizes({
        viewport: viewportWidth,
        width: totalContentWidth,
        height: scrollHeight,
      });
    };

    updateSizes();

    const resizeObserver = new ResizeObserver(updateSizes);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    window.addEventListener("resize", updateSizes);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateSizes);
    };
  }, [children]);

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(sizes.width - sizes.viewport)],
  );

  return (
    <div ref={targetRef} style={{ height: sizes.height }}>
      <motion.div
        className="sticky top-0 flex h-screen px-4 will-change-transform sm:px-8"
        ref={contentRef}
        style={{ x }}
      >
        {children}
      </motion.div>
    </div>
  );
};
