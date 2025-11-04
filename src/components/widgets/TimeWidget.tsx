"use client";

import { useState, useEffect } from "react";

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
    <div className="flex items-center gap-2">
      <p>🇫🇷</p>
      <p>{currentTime.toLocaleString(locale, Day)}</p>
      <p>{currentTime.toLocaleString(locale, Hour)}</p>
    </div>
  );
}
