import { useTranslations } from "next-intl";
import Link from "next/link";

interface CarouselSlideProps {
  title: string;
  subtitle: string;
  role: string;
  description: string;
  linkHref: string;
  client?: string;
  year?: string;
  imageAlt?: string;
}

export default function CarouselSlide({
  title,
  subtitle,
  role,
  description,
  linkHref,
  client,
  year,
  imageAlt = "Placeholder image",
}: CarouselSlideProps) {
  const t = useTranslations("Carousel");

  return (
    <div className="relative flex justify-between px-8">
      <div className="flex w-7/16 flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h3 className="text-5xl font-semibold">{title}</h3>
            <p className="text-grey text-2xl font-medium">{subtitle}</p>
          </div>
          <p className="text-grey text-4xl font-medium">{role}</p>
          <p className="text-4xl">{description}</p>
          <Link href={linkHref} className="text-2xl underline">
            {t("linkToProject")}
          </Link>
        </div>

        <div className="pt-24 *:text-base *:text-gray-600">
          <p>
            {t("client")} : {client}
          </p>
          <p>
            {t("year")} : {year}
          </p>
        </div>
      </div>
      <div className="flex w-6/16 items-center justify-center bg-gray-100">
        {/* image */}
      </div>
    </div>
  );
}
