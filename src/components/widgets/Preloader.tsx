"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  type MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "motion/react";
import * as motion from "motion/react-client";

const MS_PER_SECOND = 1000;
const MINIMUM_DISPLAY_TIME = 0.6 * MS_PER_SECOND;
const EXIT_DURATION = 0.8 * MS_PER_SECOND;

const Logo = ({ clipProgress }: { clipProgress: MotionValue<number> }) => {
  const clipY = useTransform(clipProgress, [0, 100], [500, 0]);

  return (
    <svg
      className="h-30 w-16 md:h-38 md:w-20 lg:h-45 lg:w-24"
      viewBox="0 0 267 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <motion.clipPath id="logo-fill">
          <motion.rect x="0" width="267" height="500" style={{ y: clipY }} />
        </motion.clipPath>
      </defs>
      <g clipPath="url(#logo-fill)">
        <path
          d="M38.67 494.197q4.592 1.302 9.322 2.465L44.84 500z"
          fill="#39c"
        />
        <path
          d="M200.218 334.702 47.993 496.668a273 273 0 0 1-9.323-2.465L8.329 465.697v-.458l120.645-128.338-53.378-50.12c18.602-7.401 38.431-12.287 59.362-13.39z"
          fill="#6cf"
        />
        <path
          d="M134.958 273.39c-20.931 1.097-40.76 5.983-59.362 13.39L.375 216.055l34.504-36.73 100.079 94.072z"
          fill="#39c"
        />
        <path
          d="M185.543 203.583c-.917 27.547 43.913 42.72-2.88 58.66L64.854 151.679 229.277 0l36.74 34.495-129.919 114.949 50.362 47.24c-.552 2.329-.824 4.614-.917 6.899"
          fill="#6cf"
        />
        <path
          d="M264.561 269.966v.458l-34.274 36.502-47.618-44.683c46.794-15.947 1.964-31.114 2.88-58.66.093-2.286.366-4.571.917-6.899l78.101 73.282z"
          fill="#39c"
        />
      </g>
      <g opacity={0.1}>
        <path
          d="M38.67 494.197q4.592 1.302 9.322 2.465L44.84 500z"
          fill="#39c"
        />
        <path
          d="M200.218 334.702 47.993 496.668a273 273 0 0 1-9.323-2.465L8.329 465.697v-.458l120.645-128.338-53.378-50.12c18.602-7.401 38.431-12.287 59.362-13.39z"
          fill="#6cf"
        />
        <path
          d="M134.958 273.39c-20.931 1.097-40.76 5.983-59.362 13.39L.375 216.055l34.504-36.73 100.079 94.072z"
          fill="#39c"
        />
        <path
          d="M185.543 203.583c-.917 27.547 43.913 42.72-2.88 58.66L64.854 151.679 229.277 0l36.74 34.495-129.919 114.949 50.362 47.24c-.552 2.329-.824 4.614-.917 6.899"
          fill="#6cf"
        />
        <path
          d="M264.561 269.966v.458l-34.274 36.502-47.618-44.683c46.794-15.947 1.964-31.114 2.88-58.66.093-2.286.366-4.571.917-6.899l78.101 73.282z"
          fill="#39c"
        />
      </g>
    </svg>
  );
};

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const [displayPercent, setDisplayPercent] = useState(0);
  const startTimeRef = useRef<number>(0);
  const hasCompletedRef = useRef(false);

  const progressValue = useMotionValue(0);
  const springProgress = useSpring(progressValue, {
    stiffness: 60,
    damping: 20,
    mass: 1,
  });

  const displayProgress = useTransform(springProgress, [0, 100], [0, 100]);
  const containerOpacity = useTransform(
    springProgress,
    [0, 20, 80, 100],
    [0, 1, 1, 0],
  );
  const logoScale = useTransform(springProgress, [0, 80, 100], [1, 1, 0.8]);

  useMotionValueEvent(springProgress, "change", (latest) => {
    setDisplayPercent(Math.round(latest));
  });

  useEffect(() => {
    startTimeRef.current = Date.now();

    const updateProgress = () => {
      const elapsedTime = Date.now() - startTimeRef.current;
      const adjustedProgress = Math.min(
        100,
        (elapsedTime / MINIMUM_DISPLAY_TIME) * 100,
      );
      progressValue.set(adjustedProgress);

      if (adjustedProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setTimeout(onComplete, EXIT_DURATION);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [onComplete, progressValue]);

  return (
    <motion.div
      className="bg-background fixed inset-0 z-9999 flex min-h-dvh flex-col items-center justify-center overflow-hidden"
      style={{ opacity: containerOpacity }}
    >
      <motion.div style={{ scale: logoScale }}>
        <Logo clipProgress={springProgress} />
      </motion.div>

      <p className="text-muted-foreground font-roboto-mono mt-6 text-sm">
        {displayPercent}%
      </p>

      <motion.div className="bg-muted mt-4 h-0.5 w-24 overflow-hidden rounded-full">
        <motion.div
          className="from-dark-blue to-light-blue h-full rounded-full bg-linear-to-r"
          style={{ width: displayProgress }}
        />
      </motion.div>
    </motion.div>
  );
};

export const usePreloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleComplete = useCallback(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 50);
  }, []);

  return { isLoading, handleComplete };
};
