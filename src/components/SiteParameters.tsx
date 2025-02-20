import { LocaleSwitcher, ThemeToggle } from "components";

export default function SiteParameters() {
  return (
    <div className="absolute left-1/2 top-0 flex w-full max-w-sm -translate-x-1/2 items-center gap-2">
      <ThemeToggle />
      <LocaleSwitcher />
    </div>
  );
}
