import {
  AlertTriangle,
  CreditCard,
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

import { SummaryCard } from "../components/dashboard/SummaryCard";
import { useFinance } from "../contexts/FinanceContext";
import { formatCurrency, formatDate } from "../utils/formatters";

const pieColors = ["#ef4444", "#22c55e", "#3b82f6", "#f97316"];

export function Dashboard() {
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

  const latestRevenues = revenues.slice(0, 2);
  const latestBills = bills.slice(0, 3);
  const latestEmergencyExpenses = emergencyExpenses.slice(0, 2);

  const totalExpenses =
    totalPendingBills + totalPaidBills + totalEmergencyExpenses + totalSaved;

  const summaryCards = [
    {
      title: "Saldo atual",
      value: formatCurrency(currentBalance),
      description: "Receitas menos contas, emergências e poupança",
      icon: Wallet,
    },
    {
      title: "Receitas",
      value: formatCurrency(totalRevenues),
      description: "Total de entradas cadastradas",
      icon: TrendingUp,
    },
    {
      title: "Saídas totais",
      value: formatCurrency(totalExpenses),
      description: "Contas, emergências e valores guardados",
      icon: TrendingDown,
    },
    {
      title: "Contas pendentes",
      value: formatCurrency(totalPendingBills),
      description: "Valores ainda não pagos",
      icon: CreditCard,
    },
    {
      title: "Poupança",
      value: formatCurrency(totalSaved),
      description: `${savingGoals.length} metas cadastradas`,
      icon: PiggyBank,
    },
    {
      title: "Emergências",
      value: formatCurrency(totalEmergencyExpenses),
      description: `${emergencyExpenses.length} gastos emergenciais`,
      icon: AlertTriangle,
    },
  ];

  const barChartData = [
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

  const pieChartData = [
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

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-white">Resumo financeiro</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Acompanhe entradas, saídas, contas e reservas da sua casa.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <SummaryCard
            key={card.title}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Resumo por categoria
            </h2>
            <p className="text-sm text-zinc-400">
              Comparação geral entre entradas e saídas.
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
                <YAxis stroke="#a1a1aa" fontSize={12} />
                <Tooltip
                  cursor={{ fill: "#18181b" }}
                  formatter={(value) => formatCurrency(Number(value))}
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
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Distribuição de saídas
            </h2>
            <p className="text-sm text-zinc-400">
              Como os gastos e reservas estão distribuídos.
            </p>
          </div>

          <div className="h-80">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                  >
                    {pieChartData.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
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
            {pieChartData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: pieColors[index % pieColors.length],
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
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Últimas movimentações
          </h2>

          <div className="mt-6 space-y-4">
            {latestRevenues.map((revenue) => (
              <div
                key={revenue.id}
                className="flex items-center justify-between border-b border-zinc-800 pb-3"
              >
                <div>
                  <p className="font-medium text-white">
                    {revenue.description}
                  </p>
                  <span className="text-sm text-zinc-500">
                    Receita • {formatDate(revenue.date)}
                  </span>
                </div>

                <strong className="text-emerald-400">
                  + {formatCurrency(revenue.amount)}
                </strong>
              </div>
            ))}

            {latestEmergencyExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between border-b border-zinc-800 pb-3"
              >
                <div>
                  <p className="font-medium text-white">
                    {expense.description}
                  </p>
                  <span className="text-sm text-zinc-500">
                    Emergência • {formatDate(expense.date)}
                  </span>
                </div>

                <strong className="text-orange-400">
                  - {formatCurrency(expense.amount)}
                </strong>
              </div>
            ))}

            {latestRevenues.length === 0 &&
              latestEmergencyExpenses.length === 0 && (
                <p className="text-sm text-zinc-500">
                  Nenhuma movimentação cadastrada ainda.
                </p>
              )}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Contas próximas do vencimento
          </h2>

          <div className="mt-6 space-y-4">
            {latestBills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between rounded-xl bg-zinc-950 p-4"
              >
                <div>
                  <p className="font-medium text-white">{bill.description}</p>
                  <span className="text-sm text-zinc-500">
                    Vencimento: {formatDate(bill.dueDate)} •{" "}
                    {bill.status === "paid" ? "Pago" : "Pendente"}
                  </span>
                </div>

                <strong className="text-white">
                  {formatCurrency(bill.amount)}
                </strong>
              </div>
            ))}

            {latestBills.length === 0 && (
              <p className="text-sm text-zinc-500">
                Nenhuma conta cadastrada ainda.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}