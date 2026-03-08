"use client";

import { useEffect } from "react";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Header = dynamic(() =>
  import("components/layout/Header").then((m) => m.Header),
);

const Footer = dynamic(() =>
  import("components/layout/Footer").then((m) => m.Footer),
);

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

export const LayoutClientImports = ({
  contactInfo,
}: {
  contactInfo: {
    email: string | undefined;
    phone: string | undefined;
  };
}) => {
  const pathname = usePathname();
  useEffect(() => {
    const html = document.documentElement;
    const hasScrollbar = document.body.scrollHeight > window.innerHeight;

    html.classList.toggle("scrollbar-gutter", !hasScrollbar);
  }, [pathname]);

  return (
    <>
      <Header />
      <Footer {...contactInfo} />

      <SmoothScrolling />
      <SpeedInsights />
      <CustomCursor />
      <Toaster position="bottom-center" />
    </>
  );
};
