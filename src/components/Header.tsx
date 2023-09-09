import Head from 'next/head';
import { Logo, HamburgerIcon, ThemeSwitch } from 'components';

export default function Header() {
  return (
    <>
      <Head>
        <title>Steven Godin</title>
        <meta
          name="description"
          content="Portfolio of Steven Godin, a Front-End Developer currently working at Subskill and studying at HETIC"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#66CCFF" />
      </Head>
      <header>
        <Logo />
        <HamburgerIcon />
        <ThemeSwitch />
      </header>
    </>
  );
}
