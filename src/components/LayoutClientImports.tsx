"use client";

import { type ReactNode, useEffect } from "react";

import dynamic from "next/dynamic";

import { useHideOnRoute } from "hooks/useHideOnRoute";

const CustomCursor = dynamic(
  () => import("components/ui/CustomCursor").then((m) => m.CustomCursor),
  { ssr: false },
);

const SmoothScrolling = dynamic(
  () =>
    import("components/widgets/SmoothScrolling").then((m) => m.SmoothScrolling),
  { ssr: false },
);

const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights),
  { ssr: false },
);

const Toaster = dynamic(
  () => import("components/shadcn/sonner").then((m) => m.Toaster),
  { ssr: false },
);

export const LayoutClientImports = ({ footer }: { footer: ReactNode }) => {
  const shouldHideComponent = useHideOnRoute(["/works", "/contact", "/admin"]);

  // Set transition-colors on load to avoid background color flickering
  useEffect(() => {
    document.body.classList.add("transition-colors", "duration-500");
  }, []);

  return (
    <>
      {!shouldHideComponent && footer}
      <SmoothScrolling />
      <SpeedInsights />
      <CustomCursor />
      <Toaster position="bottom-center" />
    </>
  );
};
