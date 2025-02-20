import './globals.css';
import React from 'react';
import { Footer, Header } from 'components';
import localFont from 'next/font/local';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Steven Godin',
    description:
        'Portfolio of Steven Godin, a Front-End Developer currently working for Subskill and studying at HETIC.',
    keywords: [
        'Steven Godin',
        'Front-End Developer',
        'Subskill',
        'HETIC',
        'Portfolio',
    ],
    themeColor: '#ffffff',
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
