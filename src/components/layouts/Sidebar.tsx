import { NavLink } from "react-router-dom";

import {
  AlertTriangle,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  PiggyBank,
  Settings,
  Wallet,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    label: "Receitas",
    icon: Wallet,
    path: "/receitas",
  },
  {
    label: "Contas a pagar",
    icon: CreditCard,
    path: "/contas-a-pagar",
  },
  {
    label: "Poupança",
    icon: PiggyBank,
    path: "/poupanca",
  },
  {
    label: "Emergências",
    icon: AlertTriangle,
    path: "/emergencias",
  },
  {
    label: "Relatórios",
    icon: BarChart3,
    path: "/relatorios",
  },
  {
    label: "Configurações",
    icon: Settings,
    path: "/configuracoes",
  },
];

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-72 border-r border-zinc-800 bg-zinc-950 p-6 lg:block">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white">
          CasaFinance
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Controle financeiro doméstico
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition",
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white",
                ].join(" ")
              }
            >
              <Icon size={20} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}