import type { SavingGoal } from "../types/saving-goal";

export const mockSavingGoals: SavingGoal[] = [
  {
    id: crypto.randomUUID(),
    title: "Reserva de emergência",
    targetAmount: 10000,
    currentAmount: 2500,
    category: "Segurança",
    deadline: "2026-12-31",
  },
  {
    id: crypto.randomUUID(),
    title: "Viagem em família",
    targetAmount: 6000,
    currentAmount: 900,
    category: "Família",
    deadline: "2026-10-15",
  },
];