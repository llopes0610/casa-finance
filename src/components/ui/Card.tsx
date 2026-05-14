import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-zinc-800 bg-zinc-900 p-6",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}