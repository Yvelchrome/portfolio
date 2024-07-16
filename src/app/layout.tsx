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

const Roobert = localFont({
    src: [
        {
            path: '../assets/fonts/Roobert_Regular.otf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../assets/fonts/Roobert_Medium.otf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../assets/fonts/Roobert_SemiBold.otf',
            weight: '600',
            style: 'normal',
        },
    ],
    variable: '--font-roobert',
});
const Roxborough = localFont({
    src: [
        {
            path: '../assets/fonts/RoxboroughCF_Regular.otf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../assets/fonts/RoxboroughCF_SemiBold.otf',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../assets/fonts/RoxboroughCF_SemiBoldItalic.otf',
            weight: '600',
            style: 'italic',
        },
    ],
    variable: '--font-roxborough',
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${Roobert.variable} ${Roxborough.variable} bg-white`}
        >
            <body>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
