import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Pencil,
  PlusCircle,
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
import { formatCurrency, formatDate } from "../utils/formatters";

const billSchema = z.object({
  description: z.string().min(3, "Informe uma descrição válida"),
  amount: z.coerce.number().positive("Informe um valor maior que zero"),
  category: z.string().min(1, "Selecione uma categoria"),
  dueDate: z.string().min(1, "Informe a data de vencimento"),
  status: z.enum(["pending", "paid"]),
});

type BillFormInput = z.input<typeof billSchema>;
type BillFormData = z.output<typeof billSchema>;

const categories = [
  "Aluguel",
  "Energia",
  "Água",
  "Internet",
  "Mercado",
  "Cartão",
  "Transporte",
  "Educação",
  "Saúde",
  "Outros",
];

const categoryOptions = categories.map((category) => ({
  label: category,
  value: category,
}));

const statusOptions = [
  {
    label: "Pendente",
    value: "pending",
  },
  {
    label: "Pago",
    value: "paid",
  },
];

export function Bills() {
  const {
    bills,
    totalPendingBills,
    totalPaidBills,
    addBill,
    updateBill,
    deleteBill,
    toggleBillStatus,
  } = useFinance();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [editingBillId, setEditingBillId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BillFormInput, unknown, BillFormData>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category: "",
      dueDate: "",
      status: "pending",
    },
  });

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      const matchesSearch = bill.description
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "" || bill.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "" || bill.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [bills, search, selectedCategory, selectedStatus]);

  function handleCreateBill(data: BillFormData) {
    const billData = {
      description: data.description,
      amount: data.amount,
      category: data.category,
      dueDate: data.dueDate,
      status: data.status,
    };

    if (editingBillId) {
      updateBill(editingBillId, billData);
      setEditingBillId(null);
    } else {
      addBill(billData);
    }

    reset({
      description: "",
      amount: 0,
      category: "",
      dueDate: "",
      status: "pending",
    });
  }

  function handleDeleteBill(id: string) {
    deleteBill(id);

    if (editingBillId === id) {
      handleCancelEdit();
    }
  }

  function handleToggleStatus(id: string) {
    toggleBillStatus(id);
  }

  function handleEditBill(id: string) {
    const bill = bills.find((item) => item.id === id);

    if (!bill) {
      return;
    }

    setEditingBillId(id);

    reset({
      description: bill.description,
      amount: bill.amount,
      category: bill.category,
      dueDate: bill.dueDate,
      status: bill.status,
    });
  }

  function handleCancelEdit() {
    setEditingBillId(null);

    reset({
      description: "",
      amount: 0,
      category: "",
      dueDate: "",
      status: "pending",
    });
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Contas a pagar</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Organize vencimentos, valores, status de pagamento e contas recorrentes.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-red-900/60 bg-red-950/30 px-5 py-4">
            <span className="text-sm text-red-300">Total pendente</span>
            <strong className="mt-1 block text-2xl font-bold text-red-400">
              {formatCurrency(totalPendingBills)}
            </strong>
          </div>

          <div className="rounded-2xl border border-emerald-900/60 bg-emerald-950/30 px-5 py-4">
            <span className="text-sm text-emerald-300">Total pago</span>
            <strong className="mt-1 block text-2xl font-bold text-emerald-400">
              {formatCurrency(totalPaidBills)}
            </strong>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <form onSubmit={handleSubmit(handleCreateBill)}>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-red-500/10 p-2 text-red-400">
                <PlusCircle size={22} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  {editingBillId ? "Editar conta" : "Nova conta"}
                </h2>
                <p className="text-sm text-zinc-400">
                  {editingBillId
                    ? "Atualize os dados da conta selecionada."
                    : "Registre uma nova conta da casa."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <FormInput
                label="Descrição"
                type="text"
                placeholder="Ex: Energia, internet, aluguel..."
                error={errors.description?.message}
                className="focus:border-red-500"
                {...register("description")}
              />

              <FormInput
                label="Valor"
                type="number"
                step="0.01"
                placeholder="Ex: 180"
                error={errors.amount?.message}
                className="focus:border-red-500"
                {...register("amount")}
              />

              <FormSelect
                label="Categoria"
                placeholder="Selecione uma categoria"
                options={categoryOptions}
                error={errors.category?.message}
                className="focus:border-red-500"
                {...register("category")}
              />

              <FormInput
                label="Vencimento"
                type="date"
                error={errors.dueDate?.message}
                className="focus:border-red-500"
                {...register("dueDate")}
              />

              <FormSelect
                label="Status"
                options={statusOptions}
                error={errors.status?.message}
                className="focus:border-red-500"
                {...register("status")}
              />

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
              >
                <PlusCircle size={18} />
                {editingBillId ? "Salvar alterações" : "Cadastrar conta"}
              </button>

              {editingBillId && (
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
              Contas cadastradas
            </h2>
            <p className="text-sm text-zinc-400">
              Histórico de contas registradas no orçamento.
            </p>
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-3">
            <input
              type="text"
              placeholder="Buscar por descrição..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
            />

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
            >
              <option value="">Todas as categorias</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500"
            >
              <option value="">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
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
                    Vencimento
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-zinc-500">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase text-zinc-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-zinc-500">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-zinc-800/40">
                    <td className="px-4 py-4 text-sm font-medium text-white">
                      {bill.description}
                    </td>

                    <td className="px-4 py-4 text-sm text-zinc-400">
                      {bill.category}
                    </td>

                    <td className="px-4 py-4 text-sm text-zinc-400">
                      {formatDate(bill.dueDate)}
                    </td>

                    <td className="px-4 py-4 text-right text-sm font-semibold text-white">
                      {formatCurrency(bill.amount)}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(bill.id)}
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition",
                          bill.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20",
                        ].join(" ")}
                      >
                        {bill.status === "paid" ? (
                          <>
                            <CheckCircle2 size={14} />
                            Pago
                          </>
                        ) : (
                          <>
                            <Clock size={14} />
                            Pendente
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditBill(bill.id)}
                          className="rounded-lg p-2 text-zinc-500 transition hover:bg-blue-500/10 hover:text-blue-400"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteBill(bill.id)}
                          className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredBills.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-sm text-zinc-500"
                    >
                      Nenhuma conta encontrada.
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