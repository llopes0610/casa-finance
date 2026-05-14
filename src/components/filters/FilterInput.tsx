import type { InputHTMLAttributes } from "react";

type FilterInputProps = InputHTMLAttributes<HTMLInputElement>;

export function FilterInput({ className = "", ...props }: FilterInputProps) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500",
        className,
      ].join(" ")}
    />
  );
}