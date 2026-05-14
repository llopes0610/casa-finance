import {
  BarChart3,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MetricCard } from "../components/reports/MetricCard";
import { Card } from "../components/ui/Card";
import { useFinance } from "../contexts/FinanceContext";
import { formatCurrency } from "../utils/formatters";

const chartColors = [
  "#22c55e",
  "#ef4444",
  "#3b82f6",
  "#f97316",
  "#eab308",
  "#a855f7",
  "#14b8a6",
];

function groupByCategory<T extends { category: string; amount: number }>(
  items: T[],
) {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.amount;
    return acc;
  }, {});
}

export function Reports() {
  const {
    revenues,
    bills,
    savingGoals,
    emergencyExpenses,
    totalRevenues,
    totalPendingBills,
    totalPaidBills,
    totalSaved,
    totalEmergencyExpenses,
    currentBalance,
  } = useFinance();

  const totalExpenses =
    totalPendingBills + totalPaidBills + totalSaved + totalEmergencyExpenses;

  const financialSummaryData = [
    {
      name: "Receitas",
      valor: totalRevenues,
    },
    {
      name: "Contas pagas",
      valor: totalPaidBills,
    },
    {
      name: "Pendentes",
      valor: totalPendingBills,
    },
    {
      name: "Poupança",
      valor: totalSaved,
    },
    {
      name: "Emergências",
      valor: totalEmergencyExpenses,
    },
  ];

  const expensesDistributionData = [
    {
      name: "Contas pagas",
      value: totalPaidBills,
    },
    {
      name: "Contas pendentes",
      value: totalPendingBills,
    },
    {
      name: "Poupança",
      value: totalSaved,
    },
    {
      name: "Emergências",
      value: totalEmergencyExpenses,
    },
  ].filter((item) => item.value > 0);

  const revenuesByCategory = Object.entries(groupByCategory(revenues)).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  const billsByStatus = [
    {
      name: "Pago",
      value: bills.filter((bill) => bill.status === "paid").length,
    },
    {
      name: "Pendente",
      value: bills.filter((bill) => bill.status === "pending").length,
    },
  ];

  const emergenciesByPriority = [
    {
      name: "Baixa",
      value: emergencyExpenses.filter((expense) => expense.priority === "low")
        .length,
    },
    {
      name: "Média",
      value: emergencyExpenses.filter(
        (expense) => expense.priority === "medium",
      ).length,
    },
    {
      name: "Alta",
      value: emergencyExpenses.filter((expense) => expense.priority === "high")
        .length,
    },
  ];

  const savingGoalsProgress = savingGoals.map((goal) => {
    const progress =
      goal.targetAmount > 0
        ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
        : 0;

    return {
      name: goal.title,
      progresso: Number(progress.toFixed(0)),
    };
  });

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-white">Relatórios</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Visualize gráficos, comparações e indicadores das finanças da casa.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Saldo atual"
          value={formatCurrency(currentBalance)}
          icon={Wallet}
        />

        <MetricCard
          title="Receitas"
          value={formatCurrency(totalRevenues)}
          icon={TrendingUp}
          variant="success"
        />

        <MetricCard
          title="Saídas"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          variant="danger"
        />

        <MetricCard
          title="Poupança"
          value={formatCurrency(totalSaved)}
          icon={PiggyBank}
          variant="info"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-zinc-800 p-2 text-zinc-300">
              <BarChart3 size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Resumo financeiro
              </h2>
              <p className="text-sm text-zinc-400">
                Comparação entre entradas, contas, reservas e emergências.
              </p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialSummaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
                <YAxis stroke="#a1a1aa" fontSize={12} />
                <Tooltip
                  cursor={{ fill: "#18181b" }}
                  formatter={(value: number | string) =>
                    formatCurrency(Number(value))
                  }
                  contentStyle={{
                    backgroundColor: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="valor" radius={[8, 8, 0, 0]} fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Distribuição de saídas
            </h2>
            <p className="text-sm text-zinc-400">
              Como os valores de saída estão distribuídos.
            </p>
          </div>

          <div className="h-80">
            {expensesDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesDistributionData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                  >
                    {expensesDistributionData.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value: number | string) =>
                      formatCurrency(Number(value))
                    }
                    contentStyle={{
                      backgroundColor: "#09090b",
                      border: "1px solid #27272a",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-zinc-500">
                  Nenhuma saída cadastrada ainda.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {expensesDistributionData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: chartColors[index % chartColors.length],
                  }}
                />
                <span className="text-sm text-zinc-400">
                  {item.name}:{" "}
                  <strong className="text-white">
                    {formatCurrency(item.value)}
                  </strong>
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Receitas por categoria
            </h2>
            <p className="text-sm text-zinc-400">
              Total de entradas agrupadas por categoria.
            </p>
          </div>

          <div className="space-y-3">
            {revenuesByCategory.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl bg-zinc-950 p-4"
              >
                <span className="text-sm text-zinc-300">{item.name}</span>
                <strong className="text-sm text-emerald-400">
                  {formatCurrency(item.value)}
                </strong>
              </div>
            ))}

            {revenuesByCategory.length === 0 && (
              <p className="text-sm text-zinc-500">
                Nenhuma receita cadastrada.
              </p>
            )}
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Contas por status
            </h2>
            <p className="text-sm text-zinc-400">
              Quantidade de contas pagas e pendentes.
            </p>
          </div>

          <div className="space-y-3">
            {billsByStatus.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl bg-zinc-950 p-4"
              >
                <span className="text-sm text-zinc-300">{item.name}</span>
                <strong className="text-sm text-white">{item.value}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Emergências por prioridade
            </h2>
            <p className="text-sm text-zinc-400">
              Quantidade de gastos emergenciais por nível.
            </p>
          </div>

          <div className="space-y-3">
            {emergenciesByPriority.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl bg-zinc-950 p-4"
              >
                <span className="text-sm text-zinc-300">{item.name}</span>
                <strong className="text-sm text-white">{item.value}</strong>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
            Progresso das metas
          </h2>
          <p className="text-sm text-zinc-400">
            Percentual alcançado em cada objetivo de poupança.
          </p>
        </div>

        <div className="space-y-4">
          {savingGoalsProgress.map((goal) => (
            <div key={goal.name}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-zinc-300">{goal.name}</span>
                <span className="font-medium text-white">
                  {goal.progresso}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${goal.progresso}%` }}
                />
              </div>
            </div>
          ))}

          {savingGoalsProgress.length === 0 && (
            <p className="text-sm text-zinc-500">
              Nenhuma meta cadastrada ainda.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}