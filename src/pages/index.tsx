import { SectionTitle, Hero, Paragraph } from "components";
import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <Hero />
      <section className="min-h-screen pl-44">
        <SectionTitle number="01" title="About me" />
        <Paragraph />
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
    </>
  );
};

export default Home;
