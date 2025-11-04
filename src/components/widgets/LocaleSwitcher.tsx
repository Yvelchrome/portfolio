"use client";

import { useEffect, useState, useTransition } from "react";

import { useLocale } from "next-intl";
import * as motion from "motion/react-client";

import { useMounted } from "lib/hooks/useMounted";
import { setUserLocale } from "services/locale";
import type { Locale } from "i18n/config";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const isMounted = useMounted();
  const [isPending, startTransition] = useTransition();
  const [tailwindMd, setTailwindMd] = useState(false);

  useEffect(() => {
    const checkMediaQuery = () => {
      setTailwindMd(
        window.matchMedia("only screen and (min-width: 768px)").matches,
      );
    };

    checkMediaQuery();

    const tailwindMd = window.matchMedia("only screen and (min-width: 768px)");
    tailwindMd.addEventListener("change", checkMediaQuery);

    return () => tailwindMd.removeEventListener("change", checkMediaQuery);
  }, []);

  if (!isMounted) return null;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const value = event.currentTarget.value;
    const locale = value as Locale;
    startTransition(async () => {
      await setUserLocale(locale);
    });
  }

  const labelColorClass = (localeTrigger: string) => {
    return locale === localeTrigger
      ? "text-white dark:text-black"
      : "text-black dark:text-white";
  };

  return (
    <div className="relative w-full rounded-full border border-black p-1 sm:text-wrap dark:border-white">
      <motion.div
        className="absolute rounded-full bg-black p-4 dark:bg-white"
        initial={false}
        animate={{
          x: locale === "fr" ? "0%" : "calc(100% - 8px)",
          width: "50%",
        }}
        transition={{
          duration: 0.3,
          stiffness: 300,
        }}
      />

      <div className="relative flex text-base *:w-full *:cursor-pointer *:py-1">
        <button value={"fr"} onClick={handleClick}>
          <span className={`font-medium ${labelColorClass("fr")}`}>
            {tailwindMd ? "Français" : "FR"}
          </span>
        </button>
        <button value={"en"} onClick={handleClick}>
          <span className={`font-medium ${labelColorClass("en")}`}>
            {tailwindMd ? "English" : "EN"}
          </span>
        </button>
      </div>
    </div>
  );
}
