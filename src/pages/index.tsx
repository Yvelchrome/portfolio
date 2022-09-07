import type { NextPage } from "next";
import Head from "next/head";
import HamburgerIcon from "../components/Hamburger/HamburgerIcon";
import Logo from "../components/Logo";
import SectionTitle from "../components/SectionTitle";
import ThemeSwitch from "../components/ThemeSwitch";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Steven Godin</title>
        <meta
          name="description"
          content="Portfolio of Steven Godin, a Front-End Developer currently studying at HETIC"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#66CCFF" />
      </Head>

      <main className="bg-white">
        <Logo />
        <HamburgerIcon />
        <ThemeSwitch />
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="font-roxborough-600i text-[9.3rem] text-black">
            Steven Godin
          </h1>
          <p className="font-roobert-400 text-5xl text-black">
            Front-End Developer
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
