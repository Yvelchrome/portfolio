import "./globals.css";

import React from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import * as motion from "motion/react-client";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

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
    children: React.ReactNode;
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
        className={`${Satoshi.variable} relative font-satoshi text-base font-normal transition-colors duration-300`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        >
        <NextIntlClientProvider messages={messages}>
                <Header />
                <main>{children}</main>
                <Footer />
        </NextIntlClientProvider>
      </motion.body>
        </html>
    );
}
