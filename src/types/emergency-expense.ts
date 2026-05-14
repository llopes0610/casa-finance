export type EmergencyPriority = "low" | "medium" | "high";

export type EmergencyExpense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  priority: EmergencyPriority;
  date: string;
};