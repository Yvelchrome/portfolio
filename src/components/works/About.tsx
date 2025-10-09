import { useTranslations } from "next-intl";

interface WorksAboutProps {
  paragraphs: Array<string>;
}

export default function About({ paragraphs }: WorksAboutProps) {
  const t = useTranslations("Works");

  return (
    <div className="flex min-w-full flex-col items-center justify-center space-y-6 *:w-2/3">
      <h4 className="text-5xl leading-tight font-semibold">
        {t("about_title")}
      </h4>
      <div className="space-y-6 text-4xl leading-tight">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
