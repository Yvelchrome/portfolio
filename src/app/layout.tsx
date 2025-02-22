import "./globals.css";

import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Roboto_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

import * as motion from "motion/react-client";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { Footer, Header, SmoothScrolling } from "components";
import { Toaster } from "components/shadcn/sonner";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title: "Steven Godin",
  description:
    "Portfolio of Steven Godin, a Front-End Developer. Site maintenance in progress.",
  keywords: [
    "Steven Godin",
    "Front-End Developer",
    "Subskill",
    "HETIC",
    "Portfolio",
  ],
  manifest: "./manifest.ts",
};

const RobotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto_mono",
});
const Satoshi = localFont({
  src: [
    { path: "../assets/fonts/Satoshi-Variable.woff2", style: "normal" },
    { path: "../assets/fonts/Satoshi-VariableItalic.woff2", style: "italic" },
  ],
  display: "swap",
  variable: "--font-satoshi",
});

export default async function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <motion.body
        className={`${Satoshi.variable} ${RobotoMono.variable} relative font-satoshi text-base font-normal transition-colors duration-300`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <SmoothScrolling>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
              <div className="container relative mx-auto min-h-screen">
                <Header />
                <main className="relative flex min-h-screen items-center justify-center px-4 py-32">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster position="bottom-center" />
              <SpeedInsights />
            </ThemeProvider>
          </NextIntlClientProvider>
        </SmoothScrolling>
      </motion.body>
    </html>
  );
}
