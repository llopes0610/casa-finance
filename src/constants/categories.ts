export const revenueCategories = [
  "Salário",
  "Bônus",
  "Renda extra",
  "Freelance",
  "Premiação",
  "Outros",
];

export const billCategories = [
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

export const savingGoalCategories = [
  "Segurança",
  "Família",
  "Casa",
  "Viagem",
  "Educação",
  "Saúde",
  "Outros",
];

export const emergencyCategories = [
  "Saúde",
  "Casa",
  "Transporte",
  "Família",
  "Trabalho",
  "Outros",
];

export function toSelectOptions(items: string[]) {
  return items.map((item) => ({
    label: item,
    value: item,
  }));
}