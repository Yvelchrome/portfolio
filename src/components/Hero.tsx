import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Homepage");

  return (
    <div className="space-y-1 text-center md:space-y-2">
      <h1 className="text-5xl font-bold sm:text-7xl md:text-8xl lg:text-9xl">
        Steven Godin
      </h1>
      <p className="text-2xl font-light sm:text-3xl md:text-4xl lg:text-5xl">
        {t("job_title")}
      </p>
    </div>
  );
}
