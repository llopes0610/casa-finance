import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CircleAlert,
  Pencil,
  PlusCircle,
  ShieldAlert,
  Trash2,
  XCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { FormInput } from "../components/form/FormInput";
import { FormSelect } from "../components/form/FormSelect";
import { Card } from "../components/ui/Card";
import { useFinance } from "../contexts/FinanceContext";
import type { EmergencyPriority } from "../types/emergency-expense";
import { formatCurrency, formatDate } from "../utils/formatters";

const emergencyExpenseSchema = z.object({
  description: z.string().min(3, "Informe uma descrição válida"),
  amount: z.coerce.number().positive("Informe um valor maior que zero"),
  category: z.string().min(1, "Selecione uma categoria"),
  priority: z.enum(["low", "medium", "high"]),
  date: z.string().min(1, "Informe a data"),
});

type EmergencyExpenseFormInput = z.input<typeof emergencyExpenseSchema>;
type EmergencyExpenseFormData = z.output<typeof emergencyExpenseSchema>;

const categories = [
  "Saúde",
  "Casa",
  "Transporte",
  "Família",
  "Trabalho",
  "Outros",
];

const categoryOptions = categories.map((category) => ({
  label: category,
  value: category,
}));

const priorityOptions = [
  {
    label: "Baixa",
    value: "low",
  },
  {
    label: "Média",
    value: "medium",
  },
  {
    label: "Alta",
    value: "high",
  },
];

const priorityLabels: Record<EmergencyPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const priorityStyles: Record<EmergencyPriority, string> = {
  low: "bg-blue-500/10 text-blue-400",
  medium: "bg-yellow-500/10 text-yellow-400",
  high: "bg-red-500/10 text-red-400",
};

export function Emergencies() {
  const {
    emergencyExpenses,
    totalEmergencyExpenses,
    addEmergencyExpense,
    updateEmergencyExpense,
    deleteEmergencyExpense,
  } = useFinance();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [editingEmergencyId, setEditingEmergencyId] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmergencyExpenseFormInput, unknown, EmergencyExpenseFormData>({
    resolver: zodResolver(emergencyExpenseSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category: "",
      priority: "medium",
      date: "",
    },
  });

  const filteredEmergencyExpenses = useMemo(() => {
    return emergencyExpenses.filter((expense) => {
      const matchesSearch = expense.description
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "" || expense.category === selectedCategory;

      const matchesPriority =
        selectedPriority === "" || expense.priority === selectedPriority;

      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [emergencyExpenses, search, selectedCategory, selectedPriority]);

  const highPriorityCount = useMemo(() => {
    return emergencyExpenses.filter((expense) => expense.priority === "high")
      .length;
  }, [emergencyExpenses]);

  function handleCreateEmergencyExpense(data: EmergencyExpenseFormData) {
    const emergencyData = {
      description: data.description,
      amount: data.amount,
      category: data.category,
      priority: data.priority,
      date: data.date,
    };

    if (editingEmergencyId) {
      updateEmergencyExpense(editingEmergencyId, emergencyData);
      setEditingEmergencyId(null);
    } else {
      addEmergencyExpense(emergencyData);
    }

    reset({
      description: "",
      amount: 0,
      category: "",
      priority: "medium",
      date: "",
    });
  }

  function handleDeleteEmergencyExpense(id: string) {
    deleteEmergencyExpense(id);

    if (editingEmergencyId === id) {
      handleCancelEdit();
    }
  }

  function handleEditEmergencyExpense(id: string) {
    const expense = emergencyExpenses.find((item) => item.id === id);

    if (!expense) {
      return;
    }

    setEditingEmergencyId(id);

    reset({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      priority: expense.priority,
      date: expense.date,
    });
  }

  function handleCancelEdit() {
    setEditingEmergencyId(null);

    reset({
      description: "",
      amount: 0,
      category: "",
      priority: "medium",
      date: "",
    });
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Emergências</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Registre gastos inesperados e acompanhe impactos no orçamento.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-orange-900/60 bg-orange-950/30 px-5 py-4">
            <span className="text-sm text-orange-300">
              Total emergencial
            </span>
            <strong className="mt-1 block text-2xl font-bold text-orange-400">
              {formatCurrency(totalEmergencyExpenses)}
            </strong>
          </div>

          <div className="rounded-2xl border border-red-900/60 bg-red-950/30 px-5 py-4">
            <span className="text-sm text-red-300">Alta prioridade</span>
            <strong className="mt-1 block text-2xl font-bold text-red-400">
              {highPriorityCount}
            </strong>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <form onSubmit={handleSubmit(handleCreateEmergencyExpense)}>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-orange-500/10 p-2 text-orange-400">
                <AlertTriangle size={22} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  {editingEmergencyId
                    ? "Editar emergência"
                    : "Novo gasto emergencial"}
                </h2>
                <p className="text-sm text-zinc-400">
                  {editingEmergencyId
                    ? "Atualize os dados do gasto selecionado."
                    : "Registre um imprevisto financeiro."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <FormInput
                label="Descrição"
                type="text"
                placeholder="Ex: remédio, manutenção, transporte..."
                error={errors.description?.message}
                className="focus:border-orange-500"
                {...register("description")}
              />

              <FormInput
                label="Valor"
                type="number"
                step="0.01"
                placeholder="Ex: 180"
                error={errors.amount?.message}
                className="focus:border-orange-500"
                {...register("amount")}
              />

              <FormSelect
                label="Categoria"
                placeholder="Selecione uma categoria"
                options={categoryOptions}
                error={errors.category?.message}
                className="focus:border-orange-500"
                {...register("category")}
              />

              <FormSelect
                label="Prioridade"
                options={priorityOptions}
                error={errors.priority?.message}
                className="focus:border-orange-500"
                {...register("priority")}
              />

              <FormInput
                label="Data"
                type="date"
                error={errors.date?.message}
                className="focus:border-orange-500"
                {...register("date")}
              />

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
              >
                <PlusCircle size={18} />
                {editingEmergencyId
                  ? "Salvar alterações"
                  : "Cadastrar emergência"}
              </button>

              {editingEmergencyId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                >
                  <XCircle size={18} />
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </Card>

        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Gastos emergenciais
            </h2>
            <p className="text-sm text-zinc-400">
              Histórico dos imprevistos registrados.
            </p>
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-3">
            <input
              type="text"
              placeholder="Buscar por descrição..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500"
            />

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
            >
              <option value="">Todas as categorias</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(event) => setSelectedPriority(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
            >
              <option value="">Todas as prioridades</option>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full border-collapse">
              <thead className="bg-zinc-950">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">
                    Descrição
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">
                    Data
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-zinc-500">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase text-zinc-500">
                    Prioridade
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-zinc-500">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800">
                {filteredEmergencyExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-zinc-800/40">
                    <td className="px-4 py-4 text-sm font-medium text-white">
                      {expense.description}
                    </td>

                    <td className="px-4 py-4 text-sm text-zinc-400">
                      {expense.category}
                    </td>

                    <td className="px-4 py-4 text-sm text-zinc-400">
                      {formatDate(expense.date)}
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-semibold text-orange-400">
                      {formatCurrency(expense.amount)}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                          priorityStyles[expense.priority],
                        ].join(" ")}
                      >
                        {expense.priority === "high" && (
                          <ShieldAlert size={14} />
                        )}

                        {expense.priority === "medium" && (
                          <CircleAlert size={14} />
                        )}

                        {expense.priority === "low" && (
                          <AlertTriangle size={14} />
                        )}

                        {priorityLabels[expense.priority]}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleEditEmergencyExpense(expense.id)
                          }
                          className="rounded-lg p-2 text-zinc-500 transition hover:bg-blue-500/10 hover:text-blue-400"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteEmergencyExpense(expense.id)
                          }
                          className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredEmergencyExpenses.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-sm text-zinc-500"
                    >
                      Nenhum gasto emergencial encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}