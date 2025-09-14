import { LocaleSwitcher, ThemeToggle } from "components";

export default function SiteParameters() {
  return (
    <div className="flex w-full max-w-40 items-center gap-2 sm:max-w-56 md:absolute md:left-1/2 md:max-w-sm md:-translate-x-1/2">
      <ThemeToggle />
      <LocaleSwitcher />
    </div>
  );
}
