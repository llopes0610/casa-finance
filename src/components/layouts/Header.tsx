import { Bell, Search } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Dashboard
        </h2>
        <p className="text-sm text-zinc-400">
          Visão geral das finanças da casa
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 md:flex">
          <Search size={18} className="text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
          />
        </div>

        <button className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition hover:text-white">
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}