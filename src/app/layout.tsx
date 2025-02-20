import "./globals.css";

import React from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        className={`${Satoshi.variable} relative font-satoshi text-base font-normal transition-colors duration-300`}
        >
            <body>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
