"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const VALID_THEMES = ["light", "dark", "system"] as const;
type ValidTheme = (typeof VALID_THEMES)[number];

const VALID_THEMES_SET = new Set(VALID_THEMES);

function isValidTheme(theme: string | undefined): theme is ValidTheme {
  return theme !== undefined && VALID_THEMES_SET.has(theme);
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();
  const ValidTheme = isValidTheme(theme) ? theme : "system";

  return (
    <Sonner
      theme={ValidTheme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
