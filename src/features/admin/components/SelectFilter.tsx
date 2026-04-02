"use client";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

export const SelectFilter = ({
  value,
  onChange,
  options,
  className = "",
}: SelectFilterProps) => {
  return (
    <select
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      className={`border-border bg-card text-foreground text-fluid-base w-full cursor-pointer rounded-md border px-3 py-2 sm:w-auto sm:px-4 ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
