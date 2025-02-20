import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Homepage");

  return (
    <div className="space-y-2 text-center">
      <h1 className="text-9xl font-bold">Steven Godin</h1>
      <p className="text-5xl font-light">{t("job_title")}</p>
    </div>
  );
}
