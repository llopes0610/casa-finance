import type { Revenue } from "../types/revenue";

export const mockRevenues: Revenue[] = [
  {
    id: crypto.randomUUID(),
    description: "Salário CLT",
    amount: 3600,
    category: "Salário",
    date: "2026-05-20",
  },
  {
    id: crypto.randomUUID(),
    description: "Cartão premiação",
    amount: 2400,
    category: "Premiação",
    date: "2026-06-01",
  },
];