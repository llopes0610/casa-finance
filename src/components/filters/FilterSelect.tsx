import type { SelectHTMLAttributes } from "react";

type Option = {
  label: string;
  value: string;
};

type FilterSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
  placeholder: string;
};

export function FilterSelect({
  options,
  placeholder,
  className = "",
  ...props
}: FilterSelectProps) {
  return (
    <select
      {...props}
      className={[
        "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500",
        className,
      ].join(" ")}
    >
      <option value="">{placeholder}</option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}