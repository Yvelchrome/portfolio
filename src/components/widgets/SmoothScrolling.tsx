"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame } from "motion";
import { usePathname } from "next/navigation";

let globalLenis: LenisRef["lenis"] | null = null;
export function getLenis() {
  return globalLenis;
}

function SmoothScrolling({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();

  useEffect(() => {
    const assignLenis = () => {
      if (lenisRef.current?.lenis) {
        globalLenis = lenisRef.current.lenis;
      } else {
        requestAnimationFrame(assignLenis);
      }
    };
    assignLenis();

    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }

    frame.update(update, true);

    return () => {
      cancelFrame(update);
      globalLenis = null;
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{ autoRaf: false, lerp: 0.1, duration: 1.5 }}
      ref={lenisRef}
      key={pathname}
    >
      {children}
    </ReactLenis>
  );
}

export default SmoothScrolling;
