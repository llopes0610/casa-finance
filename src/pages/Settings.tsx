import { RotateCcw, Settings as SettingsIcon, Trash2 } from "lucide-react";

import { useFinance } from "../contexts/FinanceContext";

export function Settings() {
  const { resetFinanceData } = useFinance();

  function handleResetData() {
    const confirmReset = window.confirm(
      "Tem certeza que deseja restaurar os dados padrão? Todos os dados salvos no navegador serão substituídos pelos mocks iniciais.",
    );

    if (!confirmReset) {
      return;
    }

    resetFinanceData();
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Gerencie preferências, dados locais e configurações do sistema.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
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
            <p className="text-sm text-zinc-400">
              Nesta etapa, os dados estão sendo salvos no navegador usando
              LocalStorage. Em breve, vamos substituir essa camada por backend,
              banco de dados e autenticação.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-red-900/60 bg-red-950/20 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-red-500/10 p-2 text-red-400">
              <Trash2 size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Zona de perigo
              </h2>
              <p className="text-sm text-zinc-400">
                Ações que alteram ou restauram os dados salvos.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-red-900/60 bg-zinc-950 p-4">
            <h3 className="font-medium text-white">
              Restaurar dados padrão
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Essa ação remove os dados salvos no navegador e restaura os dados
              iniciais mockados do projeto.
            </p>

            <button
              type="button"
              onClick={handleResetData}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
            >
              <RotateCcw size={18} />
              Restaurar dados padrão
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}