import type { ReactNode } from "react";

import type { Metadata, Viewport } from "next";
import { Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";

import seoMetadata from "data/seo-metadata.json";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import {
  ClientProviders,
  Footer,
  Header,
  LayoutClientImports,
} from "components";
import { JsonLdScript, getBaseUrl } from "utils";

import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edf4fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0f" },
  ],
};

const BASE_URL = getBaseUrl();
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Steven Godin",
    template: seoMetadata.titleTemplate,
  },
  description:
    "Portfolio of Steven Godin, Front-End Developer specializing in React, TypeScript, Next.js. Designs high-performance, well-crafted web interfaces.",
  keywords: seoMetadata.keywords,
  authors: [{ name: seoMetadata.author.name, url: seoMetadata.author.url }],
  creator: seoMetadata.author.name,
  publisher: seoMetadata.author.name,
  manifest: "/manifest.webmanifest",
  verification: {
    google: "3wdU-Nv33C2qKDb7jsL2kz1svVUZRnJqFAywBTV9HHE",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
    url: BASE_URL,
    siteName: seoMetadata.siteName,
    title: "Steven Godin - Front-End Developer",
    description:
      "Portfolio of Steven Godin, Front-End Developer specializing in React, TypeScript, Next.js. Designs high-performance, well-crafted web interfaces.",
    images: [
      {
        url: `${BASE_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Steven Godin - Front-End Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Steven Godin - Front-End Developer",
    description:
      "Portfolio of Steven Godin, Front-End Developer specializing in React, TypeScript, Next.js. Designs high-performance, well-crafted web interfaces.",
    creator: "@yvelchrome",
    images: [`${BASE_URL}/opengraph-image.png`],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      en: BASE_URL,
      fr: BASE_URL,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
      <head>
        <JsonLdScript schemas={["personJsonLd", "websiteJsonLd"]} />
      </head>
      <body
        className={`${Satoshi.variable} ${RobotoMono.variable} ${RoxboroughCF.variable} font-satoshi text-fluid-base text-primary-text bg-background relative font-normal`}
      >
        <NextIntlClientProvider messages={messages}>
          <ClientProviders>
            <Header />
            <main className="relative container mx-auto">{children}</main>
            <LayoutClientImports footer={<Footer />} />
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
