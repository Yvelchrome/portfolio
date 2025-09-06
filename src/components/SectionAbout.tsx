import { SectionHeader } from "components";
import { useTranslations } from "next-intl";

export default function SectionAbout() {
  const t = useTranslations("Section");

  return (
    <div>
      <SectionHeader number={"01"} intlTitle={"about"} />
      <div className="space-y-6 px-8 font-satoshi text-4xl leading-tight">
        <p>{t("about_paragraph_1")}</p>
        <p>{t("about_paragraph_2")}</p>
        <p>{t("about_paragraph_3")}</p>
      </div>
    </div>
  );
}
