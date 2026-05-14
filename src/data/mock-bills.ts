import type { Bill } from "../types/bill";

export const mockBills: Bill[] = [
  {
    id: crypto.randomUUID(),
    description: "Energia",
    amount: 180,
    category: "Energia",
    dueDate: "2026-05-18",
    status: "pending",
  },
  {
    id: crypto.randomUUID(),
    description: "Internet",
    amount: 120,
    category: "Internet",
    dueDate: "2026-05-20",
    status: "pending",
  },
  {
    id: crypto.randomUUID(),
    description: "Mercado",
    amount: 450,
    category: "Mercado",
    dueDate: "2026-05-10",
    status: "paid",
  },
];