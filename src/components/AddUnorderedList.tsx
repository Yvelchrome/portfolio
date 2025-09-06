import { useTranslations } from "next-intl";
import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

interface ListItem {
  text: string;
  icon?: string | StaticImageData | ReactNode;
  iconAlt?: string;
  iconSize?: number;
}

interface AddUnorderedListProps {
  intlTitle: string;
  items: (string | ListItem)[];
  listClassName?: string;
}

export default function AddUnorderedList({
  intlTitle,
  items,
  listClassName,
}: AddUnorderedListProps) {
  const t = useTranslations("Section");

  const renderIcon = (item: ListItem) => {
    if (!item.icon) return null;

    const defaultIconAlt = "";
    const defaultIconSize = 36;

    const icon = item.icon;
    const iconAlt = item.iconAlt ?? defaultIconAlt;
    const iconSize = item.iconSize ?? defaultIconSize;

    // If icon is a string (image path)
    // If icon is StaticImageData
    if (
      typeof icon === "string" ||
      (typeof icon === "object" && icon !== null && "src" in icon)
    ) {
      return (
        <Image src={icon} alt={iconAlt} width={iconSize} height={iconSize} />
      );
    }

    // If icon is a React component
    return (
      <span role="img" aria-label={iconAlt}>
        {icon}
      </span>
    );
  };

  // Normalize items to ListItem objects
  const normalizedItems: ListItem[] = items.map((item) =>
    typeof item === "string" ? { text: item } : item,
  );

  return (
    <div key={intlTitle} className="space-y-6">
      <h3 className="font-satoshi text-base font-medium text-light-grey dark:text-white">
        {t(intlTitle)}
      </h3>
      <ul className={listClassName}>
        {normalizedItems.map((item, index) => (
          <li
            className="flex items-center gap-4"
            key={`${intlTitle}-${index}-${item.text}`}
          >
            {renderIcon(item)}
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
