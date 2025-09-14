"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { ReactLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame } from "motion";

function SmoothScrolling({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      const time = data.timestamp;
      lenisRef.current?.lenis?.raf(time);
    }

    frame.update(update, true);

    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis
      root
      options={{ autoRaf: false, lerp: 0.1, duration: 1.5 }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
}

export default SmoothScrolling;
