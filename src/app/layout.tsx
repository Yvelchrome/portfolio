import type { ReactNode } from "react";

import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";

import { LayoutClientImports } from "components";

import "./globals.css";

const Header = dynamic(() =>
  import("components/layout/Header").then((m) => m.Header),
);

const Footer = dynamic(() =>
  import("components/layout/Footer").then((m) => m.Footer),
);

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edf4fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0f" },
  ],
};

export const metadata: Metadata = {
  title: "Steven Godin",
  description: "Portfolio of Steven Godin, Front-End Developer.",
  manifest: "/manifest.webmanifest",
};

const RobotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["300"],
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
    <html lang={locale} suppressHydrationWarning className="relative">
      <body
        className={`${Satoshi.variable} ${RobotoMono.variable} ${RoxboroughCF.variable} font-satoshi bg-background transition-colors-300 **:transition-colors-300 text-fluid-base text-primary-text relative font-normal`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <Header />
            <main className="relative container mx-auto">{children}</main>
            <LayoutClientImports footer={<Footer />} />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
