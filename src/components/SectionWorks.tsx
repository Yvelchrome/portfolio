"use client";

import { CarouselSlide, SectionHeader } from "components";

import { useRef, useState, useEffect } from "react";
import * as motion from "motion/react-client";
import { useMotionValue, animate } from "motion/react";
import { useTranslations } from "next-intl";

import { fadeInFromTop } from "lib/animationsVariants";

export default function SectionWorks() {
  const t = useTranslations("Carousel");

  const slidesData = [
    {
      id: 1,
      title: "Adeupa",
      subtitle: t("adeupa.subtitle"),
      role: t("adeupa.role"),
      description: t("adeupa.description"),
      linkHref: "/works/adeupa",
      client: "JCEP",
      year: "2022",
      imageAlt: t("adeupa.imageAlt"),
    },
    {
      id: 2,
      title: "Project Two",
      subtitle: "E-commerce Platform",
      role: "Full-Stack Developer",
      description:
        "Built a comprehensive e-commerce solution with modern technologies and seamless user experience.",
      linkHref: "http://example.com",
      client: "TechCorp",
      year: "2023",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // refs
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // motion value for horizontal translation (px)
  const x = useMotionValue(0);

  // store max translate in a ref (px)
  const maxTranslateRef = useRef(0);

  // recalc sizes on mount + resize
  useEffect(() => {
    const recalc = () => {
      maxTranslateRef.current =
        trackRef.current!.scrollWidth - window.innerWidth;

      // keep x consistent on resize (snap to current index)
      animate(x, -activeIndex * window.innerWidth, {
        type: "spring",
        stiffness: 140,
        damping: 26,
      });
    };

    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  // map vertical scroll through the tall section to horizontal x
  useEffect(() => {
    if (!sectionRef.current) return;

    const handleScroll = () => {
      const section = sectionRef.current!;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const viewportH = window.innerHeight;

      // how far we have scrolled over this section (clamped)
      const totalScroll = Math.max(
        0,
        Math.min(window.scrollY - sectionTop, sectionHeight - viewportH),
      );
      const progress =
        sectionHeight - viewportH > 0
          ? totalScroll / (sectionHeight - viewportH)
          : 0;

      // target translate in px (negative to move left)
      const targetX = -progress * maxTranslateRef.current;

      animate(x, targetX, {
        type: "spring",
        stiffness: 160,
        damping: 28,
      });

      const newIndex = Math.round(progress * (slidesData.length - 1));
      if (newIndex !== activeIndex) setActiveIndex(newIndex);
    };

    // run once to sync initial position
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeIndex]);

  const goToSlide = (index: number) => {
    if (!sectionRef.current) return;
    const sectionTop = sectionRef.current.offsetTop;
    const top = sectionTop + index * window.innerHeight;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div
      className="relative"
      ref={sectionRef}
      // N * 100vh so scrolling through the section maps to each slide
      style={{ height: `${slidesData.length * 100}vh` }}
    >
      <motion.div
        className="sticky top-0 min-h-screen overflow-hidden"
        variants={fadeInFromTop}
      >
        <SectionHeader number={"02"} intlTitle={"projects"} />

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex translate-y-1/2"
        >
          {slidesData.map((slide) => (
            <div key={slide.id} className="w-full flex-shrink-0">
              <CarouselSlide {...slide} />
            </div>
          ))}
        </motion.div>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slidesData.map((_, index) => (
            <div
              key={index}
              className={`h-2.5 w-2.5 cursor-pointer rounded-full transition-colors duration-300 ${
                index === activeIndex ? "bg-neutral-800" : "bg-neutral-300"
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
