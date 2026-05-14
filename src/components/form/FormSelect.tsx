import type { SelectHTMLAttributes } from "react";

type Option = {
  label: string;
  value: string;
};

type FormSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: Option[];
  placeholder?: string;
};

export function FormSelect({
  label,
  error,
  options,
  placeholder,
  className = "",
  ...props
}: FormSelectProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <select
        {...props}
        className={[
          "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500",
          className,
        ].join(" ")}
      >
        {placeholder && <option value="">{placeholder}</option>}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}