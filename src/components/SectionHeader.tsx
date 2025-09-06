import { useTranslations } from "next-intl";

export default function SectionHeader({
  number,
  intlTitle,
}: {
  number: string;
  intlTitle: string;
}) {
  const t = useTranslations("Section");

  return (
    <div className="mt-12">
      <div className="h-px w-full bg-black dark:bg-white"></div>

      <div className="my-12 px-8 font-satoshi">
        <p className="text-sm font-semibold">{number}</p>
        <h2 className="text-base font-medium">{t(intlTitle)}</h2>
      </div>
    </div>
  );
}
