import { useMemo, useState } from "react";
import { Pencil, PlusCircle, Trash2, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { FormInput } from "../components/form/FormInput";
import { FormSelect } from "../components/form/FormSelect";
import { Card } from "../components/ui/Card";
import {
  revenueCategories,
  toSelectOptions,
} from "../constants/categories";
import { useFinance } from "../contexts/FinanceContext";
import { formatCurrency, formatDate } from "../utils/formatters";

const revenueSchema = z.object({
  description: z.string().min(3, "Informe uma descrição válida"),
  amount: z.coerce.number().positive("Informe um valor maior que zero"),
  category: z.string().min(1, "Selecione uma categoria"),
  date: z.string().min(1, "Informe a data"),
});

type RevenueFormInput = z.input<typeof revenueSchema>;
type RevenueFormData = z.output<typeof revenueSchema>;

const categoryOptions = toSelectOptions(revenueCategories);

export function Revenues() {
  const {
    revenues,
    totalRevenues,
    addRevenue,
    updateRevenue,
    deleteRevenue,
  } = useFinance();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingRevenueId, setEditingRevenueId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RevenueFormInput, unknown, RevenueFormData>({
    resolver: zodResolver(revenueSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category: "",
      date: "",
    },
  });

  const filteredRevenues = useMemo(() => {
    return revenues.filter((revenue) => {
      const matchesSearch = revenue.description
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "" || revenue.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [revenues, search, selectedCategory]);

  function handleCreateRevenue(data: RevenueFormData) {
    const revenueData = {
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: data.date,
    };

    if (editingRevenueId) {
      updateRevenue(editingRevenueId, revenueData);
      setEditingRevenueId(null);
    } else {
      addRevenue(revenueData);
    }

    reset({
      description: "",
      amount: 0,
      category: "",
      date: "",
    });
  }

  function handleDeleteRevenue(id: string) {
    deleteRevenue(id);

    if (editingRevenueId === id) {
      handleCancelEdit();
    }
  }

  function handleEditRevenue(id: string) {
    const revenue = revenues.find((item) => item.id === id);

    if (!revenue) {
      return;
    }

    setEditingRevenueId(id);

    reset({
      description: revenue.description,
      amount: revenue.amount,
      category: revenue.category,
      date: revenue.date,
    });
  }

  function handleCancelEdit() {
    setEditingRevenueId(null);

    reset({
      description: "",
      amount: 0,
      category: "",
      date: "",
    });
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Receitas</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Cadastre salários, bônus, rendas extras e outras entradas da casa.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-900/60 bg-emerald-950/30 px-5 py-4">
          <span className="text-sm text-emerald-300">Total de receitas</span>
          <strong className="mt-1 block text-2xl font-bold text-emerald-400">
            {formatCurrency(totalRevenues)}
          </strong>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <form onSubmit={handleSubmit(handleCreateRevenue)}>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
                <PlusCircle size={22} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  {editingRevenueId ? "Editar receita" : "Nova receita"}
                </h2>
                <p className="text-sm text-zinc-400">
                  {editingRevenueId
                    ? "Atualize os dados da receita selecionada."
                    : "Registre uma nova entrada financeira."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <FormInput
                label="Descrição"
                type="text"
                placeholder="Ex: Salário, bônus, freelance..."
                error={errors.description?.message}
                className="focus:border-emerald-500"
                {...register("description")}
              />

              <FormInput
                label="Valor"
                type="number"
                step="0.01"
                placeholder="Ex: 3600"
                error={errors.amount?.message}
                className="focus:border-emerald-500"
                {...register("amount")}
              />

              <FormSelect
                label="Categoria"
                placeholder="Selecione uma categoria"
                options={categoryOptions}
                error={errors.category?.message}
                className="focus:border-emerald-500"
                {...register("category")}
              />

              <FormInput
                label="Data"
                type="date"
                error={errors.date?.message}
                className="focus:border-emerald-500"
                {...register("date")}
              />

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
              >
                <PlusCircle size={18} />
                {editingRevenueId ? "Salvar alterações" : "Cadastrar receita"}
              </button>

              {editingRevenueId && (
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
              Receitas cadastradas
            </h2>
            <p className="text-sm text-zinc-400">
              Histórico de entradas financeiras registradas.
            </p>
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-2">
            <input
              type="text"
              placeholder="Buscar por descrição..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-500"
            />

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500"
            >
              <option value="">Todas as categorias</option>

              {revenueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
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
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-zinc-500">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800">
                {filteredRevenues.map((revenue) => (
                  <tr key={revenue.id} className="hover:bg-zinc-800/40">
                    <td className="px-4 py-4 text-sm font-medium text-white">
                      {revenue.description}
                    </td>

                    <td className="px-4 py-4 text-sm text-zinc-400">
                      {revenue.category}
                    </td>

                    <td className="px-4 py-4 text-sm text-zinc-400">
                      {formatDate(revenue.date)}
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-semibold text-emerald-400">
                      {formatCurrency(revenue.amount)}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditRevenue(revenue.id)}
                          className="rounded-lg p-2 text-zinc-500 transition hover:bg-blue-500/10 hover:text-blue-400"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteRevenue(revenue.id)}
                          className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredRevenues.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-sm text-zinc-500"
                    >
                      Nenhuma receita encontrada.
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