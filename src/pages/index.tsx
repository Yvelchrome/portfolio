import { SectionTitle, Hero, Paragraph } from "components";
import { NextPage } from "next";

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
        <section className="min-h-screen pl-44">
          <SectionTitle number="01" title="About me" />
        </section>
        <section className="min-h-screen pl-44">
          <SectionTitle number="02" title="Works" />
        </section>
        <section className="min-h-screen pl-44">
          <SectionTitle number="03" title="Skills" />
        </section>
        <section className="pl-44">
          <SectionTitle number="04" title="Contact" />
        </section>
      </main>
      <footer className="pl-44">
        <p className="font-roobert-400 text-base text-black">
          © 2022 - Steven Godin
        </p>
      </footer>
    </>
  );
};

export default Home;
