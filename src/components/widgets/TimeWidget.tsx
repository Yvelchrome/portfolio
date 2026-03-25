"use client";

import { useEffect, useState } from "react";

import { useLocale } from "next-intl";

import { useMounted } from "hooks/useMounted";

export const TimeWidget = () => {
  const isMounted = useMounted();
  const locale = useLocale();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (!isMounted) return null;

  const dayOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Paris",
    month: "numeric",
    day: "numeric",
  };

  const hourOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Paris",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  return (
    <div className="flex items-center gap-2">
      <p>🇫🇷</p>
      <p>{currentTime.toLocaleString(locale, dayOptions)}</p>
      <p>{currentTime.toLocaleString(locale, hourOptions)}</p>
    </div>
  );
};
