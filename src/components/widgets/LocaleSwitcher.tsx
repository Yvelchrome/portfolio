"use client";

import { useEffect, useRef, useTransition } from "react";

import * as motion from "motion/react-client";

import { useMounted } from "lib/hooks/useMounted";

import { useLocale } from "next-intl";
import { setUserLocale } from "services/locale";
import type { Locale } from "i18n/config";

const LOCALES = [
  { code: "fr" as const, short: "FR", long: "Français" },
  { code: "en" as const, short: "EN", long: "English" },
];

export const LocaleSwitcher = () => {
  const locale = useLocale();
  const isMounted = useMounted();
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        document.body.dataset.localeChanging = "false";
      }
    };
  }, []);

  useEffect(() => {
    document.body.dataset.localeChanging = "false";
  }, [locale]);

  if (!isMounted) return null;

  function handleLocaleChange(newLocale: Locale) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    document.body.dataset.localeChanging = "true";

    timeoutRef.current = setTimeout(() => {
      startTransition(() => {
        setUserLocale(newLocale);
      });
    }, 250);
  }

  return (
    <div className="relative w-full rounded-full border border-black p-1 dark:border-white">
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

      <div className="relative flex">
        {LOCALES.map(({ code, short, long }) => {
          const isActive = locale === code;

          return (
            <button
              key={code}
              onClick={() => handleLocaleChange(code)}
              className={`*:no-locale-animation w-full cursor-pointer py-1 text-base font-medium ${
                isActive
                  ? "text-white dark:text-black"
                  : "text-black dark:text-white"
              }`}
              aria-pressed={isActive}
              disabled={isPending || isActive}
            >
              <span className="hidden md:block">{long}</span>
              <span className="block md:hidden">{short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
