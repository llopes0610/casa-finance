import {
  Database,
  LogOut,
  RefreshCcw,
  Settings as SettingsIcon,
  ShieldAlert,
  UserCircle,
} from "lucide-react";
import { useState } from "react";

import { Card } from "../components/ui/Card";
import { useAuth } from "../contexts/AuthContext";
import { useFinance } from "../contexts/FinanceContext";

export function Settings() {
  const { user, logout } = useAuth();
  const { resetFinanceData, isLoadingFinanceData } = useFinance();

  const [successMessage, setSuccessMessage] = useState("");

  async function handleReloadData() {
    try {
      setSuccessMessage("");

      await resetFinanceData();

      setSuccessMessage("Dados recarregados com sucesso.");
    } catch {
      setSuccessMessage("");
      window.alert("Não foi possível recarregar os dados.");
    }
  }

  function handleLogout() {
    const confirmLogout = window.confirm(
      "Tem certeza que deseja sair do sistema?",
    );

    if (!confirmLogout) {
      return;
    }

    logout();
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Gerencie sua conta, sessão e preferências do sistema.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-zinc-800 p-2 text-zinc-300">
              <UserCircle size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Conta logada
              </h2>
              <p className="text-sm text-zinc-400">
                Informações do usuário autenticado.
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div>
              <span className="text-xs uppercase text-zinc-500">Nome</span>
              <p className="mt-1 text-sm font-medium text-white">
                {user?.name ?? "Usuário"}
              </p>
            </div>

            <div>
              <span className="text-xs uppercase text-zinc-500">E-mail</span>
              <p className="mt-1 text-sm font-medium text-white">
                {user?.email ?? "E-mail não informado"}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-zinc-800 p-2 text-zinc-300">
              <SettingsIcon size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Preferências do sistema
              </h2>
              <p className="text-sm text-zinc-400">
                Configurações gerais da aplicação.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-sm leading-6 text-zinc-400">
              O sistema agora está conectado ao backend com autenticação JWT e
              banco Supabase. As receitas, contas, metas e emergências são
              carregadas da API.
            </p>
          </div>
        </Card>

        <Card>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400">
              <Database size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Dados financeiros
              </h2>
              <p className="text-sm text-zinc-400">
                Sincronize novamente os dados vindos do banco.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <h3 className="font-medium text-white">Recarregar dados</h3>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Essa ação busca novamente receitas, contas, metas e emergências
              diretamente da API.
            </p>

            {successMessage && (
              <div className="mt-4 rounded-xl border border-emerald-900/60 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300">
                {successMessage}
              </div>
            )}

            <button
              type="button"
              onClick={handleReloadData}
              disabled={isLoadingFinanceData}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw size={18} />
              {isLoadingFinanceData ? "Recarregando..." : "Recarregar dados"}
            </button>
          </div>
        </Card>

        <Card className="border-red-900/60 bg-red-950/20">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-red-500/10 p-2 text-red-400">
              <LogOut size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">Sessão</h2>
              <p className="text-sm text-zinc-400">
                Gerencie o acesso atual ao sistema.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-red-900/60 bg-zinc-950 p-4">
            <h3 className="font-medium text-white">Sair do sistema</h3>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Essa ação remove o token salvo no navegador e retorna para a tela
              de login.
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
            >
              <LogOut size={18} />
              Sair da conta
            </button>
          </div>
        </Card>
      </section>

      <section>
        <Card className="border-yellow-900/60 bg-yellow-950/10">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-yellow-500/10 p-2 text-yellow-400">
              <ShieldAlert size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Próxima melhoria de segurança
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Antes de criar ações como “apagar todos os dados”, o ideal é
                vincular receitas, contas, metas e emergências ao usuário logado
                no banco. Assim cada usuário verá apenas os próprios dados.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}