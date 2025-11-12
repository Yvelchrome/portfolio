import { useTranslations } from "next-intl";

export const SectionHeader = ({
  number,
  intlTitle,
}: {
  number: string;
  intlTitle: string;
}) => {
  const t = useTranslations("Section");

  return (
    <>
      <div className="h-px w-full bg-black dark:bg-white"></div>

      <div className="font-satoshi my-8 px-4 sm:my-12 sm:px-8">
        <p className="no-locale-animation text-sm font-semibold">{number}</p>
        <h2 className="text-base font-medium">{t(intlTitle)}</h2>
      </div>
    </>
  );
};
