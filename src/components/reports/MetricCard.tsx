import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "danger" | "info";
};

const variantStyles = {
  default: {
    card: "border-zinc-800 bg-zinc-900",
    text: "text-zinc-400",
    value: "text-white",
    icon: "text-zinc-400",
  },
  success: {
    card: "border-emerald-900/60 bg-emerald-950/30",
    text: "text-emerald-300",
    value: "text-emerald-400",
    icon: "text-emerald-400",
  },
  danger: {
    card: "border-red-900/60 bg-red-950/30",
    text: "text-red-300",
    value: "text-red-400",
    icon: "text-red-400",
  },
  info: {
    card: "border-blue-900/60 bg-blue-950/30",
    text: "text-blue-300",
    value: "text-blue-400",
    icon: "text-blue-400",
  },
};

export function MetricCard({
  title,
  value,
  icon: Icon,
  variant = "default",
}: MetricCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={["rounded-2xl border p-5", styles.card].join(" ")}>
      <div className="mb-4 flex items-center justify-between">
        <span className={["text-sm", styles.text].join(" ")}>
          {title}
        </span>

        <Icon size={20} className={styles.icon} />
      </div>

      <strong className={["block text-2xl font-bold", styles.value].join(" ")}>
        {value}
      </strong>
    </div>
  );
}