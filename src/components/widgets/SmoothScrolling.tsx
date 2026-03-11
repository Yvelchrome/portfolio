"use client";

import { useEffect, useRef } from "react";

import { usePathname } from "next/navigation";

import { type LenisRef, ReactLenis } from "lenis/react";
import { cancelFrame, frame } from "motion";

export const SmoothScrolling = () => {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();

  // RAF loop for lenis
  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }

    frame.update(update, true);

    return () => {
      cancelFrame(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{ autoRaf: false, lerp: 0.1, autoToggle: true }}
      ref={lenisRef}
      key={pathname}
    />
  );
};
