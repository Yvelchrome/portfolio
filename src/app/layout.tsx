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

import { CustomCursor, Footer, Header, SmoothScrolling } from "components";
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
  variable: "--font-roboto-mono",
});
const Satoshi = localFont({
  src: [
    { path: "../assets/fonts/Satoshi-Variable.woff2", style: "normal" },
    { path: "../assets/fonts/Satoshi-VariableItalic.woff2", style: "italic" },
  ],
  display: "swap",
  variable: "--font-satoshi",
});
const RoxboroughCF = localFont({
  src: [
    { path: "../assets/fonts/RoxboroughCF-Regular.woff2", style: "normal" },
    {
      path: "../assets/fonts/RoxboroughCF-RegularItalic.woff2",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-roxboroughcf",
});

export default async function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <motion.body
        className={`${Satoshi.variable} ${RobotoMono.variable} ${RoxboroughCF.variable} font-satoshi bg-background transition-colors-300 **:transition-colors-300 text-fluid-base relative font-normal text-black dark:text-white`}
      >
        <SmoothScrolling>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
              <Header />
              <main className="relative container mx-auto">{children}</main>
              <Footer />
              <CustomCursor />
              <Toaster position="bottom-center" />
              <SpeedInsights />
            </ThemeProvider>
          </NextIntlClientProvider>
        </SmoothScrolling>
      </motion.body>
    </html>
  );
}
