import type { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-400">
          {title}
        </span>

        <div className="rounded-xl bg-zinc-800 p-2 text-zinc-300">
          <Icon size={20} />
        </div>
      </div>

      <strong className="block text-2xl font-bold text-white">
        {value}
      </strong>

      <p className="mt-2 text-sm text-zinc-500">
        {description}
      </p>
    </div>
  );
}