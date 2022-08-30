import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import logo from "../assets/images/logo500x.svg";

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

      <main className="bg-black">
        <div className="fixed top-12 left-12">
          <Image src={logo} alt="" width={40} height={75} />
        </div>
        <section className="mx-auto flex flex-col items-center justify-center min-h-screen"></section>
      </main>
    </>
  );
};

export default Home;
