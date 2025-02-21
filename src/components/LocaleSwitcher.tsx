"use client";

import { useTransition } from "react";

import { useLocale } from "next-intl";
import * as motion from "motion/react-client";

import { useMounted } from "lib/hooks/useMounted";
import { setUserLocale } from "services/locale";
import type { Locale } from "i18n/config";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const isMounted = useMounted();
  const [isPending, startTransition] = useTransition();
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
    <div className="relative w-full rounded-full border border-black p-1 transition-colors sm:text-wrap dark:border-white">
      <motion.div
        className="absolute rounded-full bg-black p-4 transition-colors dark:bg-white"
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

      <div className="relative flex">
        <button value={"fr"} onClick={handleClick} className={"w-full py-1"}>
          <span
            className={`font-medium transition-colors ${labelColorClass("fr")}`}
          >
            Français
          </span>
        </button>
        <button value={"en"} onClick={handleClick} className={"w-full py-1"}>
          <span
            className={`font-medium transition-colors ${labelColorClass("en")}`}
          >
            English
          </span>
        </button>
      </div>
    </div>
  );
}
