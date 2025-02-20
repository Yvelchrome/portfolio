"use client";

import { useTransition } from "react";

import { useLocale } from "next-intl";
import * as motion from "motion/react-client";

import { setUserLocale } from "services/locale";
import type { Locale } from "i18n/config";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const value = event.currentTarget.value;
    const locale = value as Locale;
    startTransition(async () => {
      await setUserLocale(locale);
    });
  }

  return (
    <div className="relative w-full rounded-full border border-black p-1 transition-colors dark:border-white">
      <motion.div
        className="absolute h-8 rounded-full bg-black transition-colors dark:bg-white"
        initial={false}
        animate={{
          x: locale === "fr" ? "0%" : "95%",
          width: "50%",
        }}
        transition={{
          duration: 0.3,
          stiffness: 300,
        }}
      />

      <div className="relative flex">
        <button value={"fr"} onClick={handleClick} className={"w-full py-1"}>
          <span
            className={`font-medium transition-colors ${
              locale === "fr"
                ? "text-white dark:text-black"
                : "text-black dark:text-white"
            }`}
          >
            Français
          </span>
        </button>
        <button value={"en"} onClick={handleClick} className={"w-full py-1"}>
          <span
            className={`font-medium transition-colors ${
              locale === "en"
                ? "text-white dark:text-black"
                : "text-black dark:text-white"
            }`}
          >
            English
          </span>
        </button>
      </div>
    </div>
  );
}
