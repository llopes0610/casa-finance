type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 p-10 text-center">
      <p className="text-sm text-zinc-500">{message}</p>
    </div>
  );
}