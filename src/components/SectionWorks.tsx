"use client";

import { useRef, useState } from "react";
import * as motion from "motion/react-client";
import { CarouselSlide, SectionHeader } from "components";
import { fadeInFromTop } from "lib/animationsVariants";

const slidesData = [
  {
    id: 1,
    title: "Adeupa",
    subtitle: "Proof of Concept • PWA",
    role: "Front-End Developer • UI Designer",
    description:
      "Developed to help local businesses from Paris to get more visibility.",
    linkHref: "http://example.com",
    client: "JCEP",
    year: "2022",
    imageAlt: "Project One Image",
  },
  {
    id: 2,
    title: "Project Two",
    subtitle: "Subtitle Two",
    role: "Role Two",
    description: "Description for project two.",
    linkHref: "http://example.com",
  },
];

export default function SectionWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  return (
    <motion.div
      className="relative w-full overflow-hidden"
      variants={fadeInFromTop}
    >
      <SectionHeader number={"02"} intlTitle={"projects"} />

      <motion.div
        ref={carouselRef}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-scroll"
        onScroll={handleScroll}
      >
        {slidesData.map((slide, index) => (
          <motion.div
            key={slide.id}
            className="min-w-full flex-shrink-0 snap-start"
          >
            <CarouselSlide {...slide} />
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slidesData.map((slide, index) => (
          <div
            key={index}
            className={`h-2.5 w-2.5 cursor-pointer rounded-full transition-colors duration-300 ${
              index === activeIndex ? "bg-neutral-800" : "bg-neutral-300"
            }`}
            onClick={() => {
              if (carouselRef.current) {
                carouselRef.current.scrollTo({
                  left: index * carouselRef.current.clientWidth,
                  behavior: "smooth",
                });
              }
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
