import { useMemo, useState } from "react";
import {
  Pencil,
  PiggyBank,
  PlusCircle,
  Target,
  Trash2,
  XCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { FormInput } from "../components/form/FormInput";
import { FormSelect } from "../components/form/FormSelect";
import { Card } from "../components/ui/Card";
import {
  savingGoalCategories,
  toSelectOptions,
} from "../constants/categories";
import { useFinance } from "../contexts/FinanceContext";
import { formatCurrency, formatDate } from "../utils/formatters";
import { FilterInput } from "../components/filters/FilterInput";
import { FilterSelect } from "../components/filters/FilterSelect";

const savingGoalSchema = z.object({
  title: z.string().min(3, "Informe um nome válido para a meta"),
  targetAmount: z.coerce
    .number()
    .positive("Informe um valor alvo maior que zero"),
  currentAmount: z.coerce
    .number()
    .min(0, "O valor atual não pode ser negativo"),
  category: z.string().min(1, "Selecione uma categoria"),
  deadline: z.string().min(1, "Informe o prazo da meta"),
});

type SavingGoalFormInput = z.input<typeof savingGoalSchema>;
type SavingGoalFormData = z.output<typeof savingGoalSchema>;

const categoryOptions = toSelectOptions(savingGoalCategories);

export function Savings() {
  const {
    savingGoals,
    totalSaved,
    addSavingGoal,
    updateSavingGoal,
    deleteSavingGoal,
    addMoneyToSavingGoal,
  } = useFinance();

  const [savingDeposits, setSavingDeposits] = useState<Record<string, string>>(
    {},
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingSavingGoalId, setEditingSavingGoalId] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SavingGoalFormInput, unknown, SavingGoalFormData>({
    resolver: zodResolver(savingGoalSchema),
    defaultValues: {
      title: "",
      targetAmount: 0,
      currentAmount: 0,
      category: "",
      deadline: "",
    },
  });

  const totalTarget = useMemo(() => {
    return savingGoals.reduce((total, goal) => total + goal.targetAmount, 0);
  }, [savingGoals]);

  const filteredSavingGoals = useMemo(() => {
    return savingGoals.filter((goal) => {
      const matchesSearch = goal.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "" || goal.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [savingGoals, search, selectedCategory]);

  function handleCreateSavingGoal(data: SavingGoalFormData) {
    const savingGoalData = {
      title: data.title,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount,
      category: data.category,
      deadline: data.deadline,
    };

    if (editingSavingGoalId) {
      updateSavingGoal(editingSavingGoalId, savingGoalData);
      setEditingSavingGoalId(null);
    } else {
      addSavingGoal(savingGoalData);
    }

    reset({
      title: "",
      targetAmount: 0,
      currentAmount: 0,
      category: "",
      deadline: "",
    });
  }

  function handleDeleteSavingGoal(id: string) {
    deleteSavingGoal(id);

    if (editingSavingGoalId === id) {
      handleCancelEdit();
    }
  }

  function handleEditSavingGoal(id: string) {
    const goal = savingGoals.find((item) => item.id === id);

    if (!goal) {
      return;
    }

    setEditingSavingGoalId(id);

    reset({
      title: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      category: goal.category,
      deadline: goal.deadline,
    });
  }

  function handleCancelEdit() {
    setEditingSavingGoalId(null);

    reset({
      title: "",
      targetAmount: 0,
      currentAmount: 0,
      category: "",
      deadline: "",
    });
  }

  function handleAddMoneyToGoal(id: string) {
    const amount = Number(savingDeposits[id]);

    if (!amount || amount <= 0) {
      return;
    }

    addMoneyToSavingGoal(id, amount);

    setSavingDeposits((state) => ({
      ...state,
      [id]: "",
    }));
  }

  function getProgress(currentAmount: number, targetAmount: number) {
    if (targetAmount <= 0) {
      return 0;
    }

    const progress = (currentAmount / targetAmount) * 100;

    return Math.min(progress, 100);
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Poupança</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Acompanhe reservas, metas financeiras e objetivos familiares.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-blue-900/60 bg-blue-950/30 px-5 py-4">
            <span className="text-sm text-blue-300">Total guardado</span>
            <strong className="mt-1 block text-2xl font-bold text-blue-400">
              {formatCurrency(totalSaved)}
            </strong>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4">
            <span className="text-sm text-zinc-400">Objetivo total</span>
            <strong className="mt-1 block text-2xl font-bold text-white">
              {formatCurrency(totalTarget)}
            </strong>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <form onSubmit={handleSubmit(handleCreateSavingGoal)}>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400">
                <PiggyBank size={22} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  {editingSavingGoalId ? "Editar meta" : "Nova meta"}
                </h2>
                <p className="text-sm text-zinc-400">
                  {editingSavingGoalId
                    ? "Atualize os dados da meta selecionada."
                    : "Crie um objetivo financeiro para sua casa."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <FormInput
                label="Nome da meta"
                type="text"
                placeholder="Ex: Reserva de emergência"
                error={errors.title?.message}
                className="focus:border-blue-500"
                {...register("title")}
              />

              <FormInput
                label="Valor alvo"
                type="number"
                step="0.01"
                placeholder="Ex: 10000"
                error={errors.targetAmount?.message}
                className="focus:border-blue-500"
                {...register("targetAmount")}
              />

              <FormInput
                label="Valor já guardado"
                type="number"
                step="0.01"
                placeholder="Ex: 2500"
                error={errors.currentAmount?.message}
                className="focus:border-blue-500"
                {...register("currentAmount")}
              />

              <FormSelect
                label="Categoria"
                placeholder="Selecione uma categoria"
                options={categoryOptions}
                error={errors.category?.message}
                className="focus:border-blue-500"
                {...register("category")}
              />

              <FormInput
                label="Prazo"
                type="date"
                error={errors.deadline?.message}
                className="focus:border-blue-500"
                {...register("deadline")}
              />

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                <PlusCircle size={18} />
                {editingSavingGoalId ? "Salvar alterações" : "Cadastrar meta"}
              </button>

              {editingSavingGoalId && (
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
              Metas cadastradas
            </h2>
            <p className="text-sm text-zinc-400">
              Acompanhe o progresso de cada objetivo.
            </p>
          </div>

         <div className="mb-6 grid gap-3 md:grid-cols-2">
  <FilterInput
    type="text"
    placeholder="Buscar por meta..."
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    className="focus:border-blue-500"
  />

  <FilterSelect
    placeholder="Todas as categorias"
    value={selectedCategory}
    onChange={(event) => setSelectedCategory(event.target.value)}
    options={categoryOptions}
    className="focus:border-blue-500"
  />
</div>

          <div className="space-y-4">
            {filteredSavingGoals.map((goal) => {
              const progress = getProgress(
                goal.currentAmount,
                goal.targetAmount,
              );

              const remainingAmount = goal.targetAmount - goal.currentAmount;

              return (
                <div
                  key={goal.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400">
                        <Target size={20} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">
                          {goal.title}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500">
                          {goal.category} • Prazo: {formatDate(goal.deadline)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditSavingGoal(goal.id)}
                        className="rounded-lg p-2 text-zinc-500 transition hover:bg-blue-500/10 hover:text-blue-400"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSavingGoal(goal.id)}
                        className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-zinc-400">
                      {formatCurrency(goal.currentAmount)} guardados
                    </span>

                    <span className="font-medium text-white">
                      {progress.toFixed(0)}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-zinc-900 p-3">
                      <span className="text-xs text-zinc-500">Meta</span>
                      <strong className="mt-1 block text-sm text-white">
                        {formatCurrency(goal.targetAmount)}
                      </strong>
                    </div>

                    <div className="rounded-xl bg-zinc-900 p-3">
                      <span className="text-xs text-zinc-500">Falta</span>
                      <strong className="mt-1 block text-sm text-blue-400">
                        {formatCurrency(Math.max(remainingAmount, 0))}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Valor para adicionar"
                      value={savingDeposits[goal.id] ?? ""}
                      onChange={(event) =>
                        setSavingDeposits((state) => ({
                          ...state,
                          [goal.id]: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500"
                    />

                    <button
                      type="button"
                      onClick={() => handleAddMoneyToGoal(goal.id)}
                      className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 sm:min-w-36"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredSavingGoals.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-800 p-10 text-center">
                <p className="text-sm text-zinc-500">
                  Nenhuma meta encontrada.
                </p>
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}