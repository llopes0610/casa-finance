import type { EmergencyExpense } from "../types/emergency-expense";

export const mockEmergencyExpenses: EmergencyExpense[] = [
  {
    id: crypto.randomUUID(),
    description: "Remédio",
    amount: 85,
    category: "Saúde",
    priority: "medium",
    date: "2026-05-12",
  },
  {
    id: crypto.randomUUID(),
    description: "Conserto do chuveiro",
    amount: 180,
    category: "Casa",
    priority: "high",
    date: "2026-05-14",
  },
];