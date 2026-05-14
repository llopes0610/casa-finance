import type { InputHTMLAttributes } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function FormInput({ label, error, className = "", ...props }: FormInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <input
        {...props}
        className={[
          "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500",
          className,
        ].join(" ")}
      />

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}