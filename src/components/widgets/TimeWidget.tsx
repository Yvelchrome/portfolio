"use client";

import { useState, useEffect } from "react";

import * as motion from "motion/react-client";
import { useLocale } from "next-intl";
import { useMounted } from "lib/hooks/useMounted";

export default function TimeWidget() {
  const isMounted = useMounted();
  const locale = useLocale();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isMounted) return null;

  const Day: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Paris",
    month: "numeric",
    day: "numeric",
  };

  const Hour: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Paris",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  return (
    <motion.div
      className="flex items-center gap-2"
      whileInView={{
        y: [0, -4, 0],
        transition: {
          delay: 0.6,
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <p>🇫🇷</p>
      <p>{currentTime.toLocaleString(locale, Day)}</p>
      <p>{currentTime.toLocaleString(locale, Hour)}</p>
    </motion.div>
  );
}
