"use client";

import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/shadcn/select";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

export const SelectFilter = ({
  value,
  onChange,
  options,
}: SelectFilterProps) => {
  const tCommon = useTranslations("Common");

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full max-w-40 cursor-pointer px-3 py-2 *:pointer-events-none sm:px-4">
        <SelectValue placeholder={tCommon("filter_select_one")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.value === value}
              className="cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
