import type { ReactNode } from "react";

import Image, { type StaticImageData } from "next/image";

import { useTranslations } from "next-intl";

import { ConditionalWrapper } from "utils";

interface ListItem {
  text: string;
  href?: string;
  icon?: string | StaticImageData | ReactNode;
  iconAlt?: string;
  iconSize?: number;
}

interface AddUnorderedListProps {
  intlTitle: string;
  items: (string | ListItem)[];
  listClassName?: string;
}

interface ListItemIconProps {
  icon?: string | StaticImageData | ReactNode | undefined;
  iconAlt?: string | undefined;
  iconSize?: number | undefined;
}

const ListItemIcon = ({
  icon,
  iconAlt = "",
  iconSize = 40,
}: ListItemIconProps) => {
  if (!icon) return null;

  if (typeof icon === "string" || (typeof icon === "object" && "src" in icon)) {
    return (
      <Image
        src={icon}
        alt={iconAlt}
        className="h-[1em] w-[1em]"
        width={iconSize}
        height={iconSize}
      />
    );
  }

  return (
    <span
      className="h-[1em] w-[1em] *:h-full *:w-full *:drop-shadow-sm"
      role="img"
      aria-label={iconAlt}
    >
      {icon}
    </span>
  );
};

export const AddUnorderedList = ({
  intlTitle,
  items,
  listClassName,
}: AddUnorderedListProps) => {
  const t = useTranslations("Section");

  const normalizedItems: ListItem[] = items.map((item) =>
    typeof item === "string" ? { text: item } : item,
  );

  return (
    <div key={intlTitle} className="space-y-2 lg:space-y-6">
      <h3 className="text-primary-text text-base font-medium">
        {t(intlTitle)}
      </h3>
      <ul className={listClassName}>
        {normalizedItems.map((item, index) => (
          <li
            className="no-locale-animation **:no-locale-animation text-primary-text flex items-center lg:gap-4"
            key={`${intlTitle}-${String(index)}-${item.text}`}
          >
            <ConditionalWrapper
              condition={!!item.href}
              wrapper={(children) => (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 *:pointer-events-none sm:gap-4"
                >
                  {children}
                </a>
              )}
            >
              <ListItemIcon
                icon={item.icon}
                iconAlt={item.iconAlt}
                iconSize={item.iconSize}
              />
              <span
                className={
                  item.href &&
                  "relative after:absolute after:top-full after:right-0 after:h-0.5 after:w-full after:origin-center after:scale-0 after:bg-white after:transition-transform after:duration-400 group-hover:after:scale-100"
                }
              >
                {item.text}
              </span>
            </ConditionalWrapper>
          </li>
        ))}
      </ul>
    </div>
  );
};
