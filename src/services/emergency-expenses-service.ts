import type { EmergencyExpense } from "../types/emergency-expense";

import { apiRequest } from "./api";

type EmergencyExpensePayload = Omit<EmergencyExpense, "id" | "createdAt">;

export async function getEmergencyExpenses() {
  return apiRequest<EmergencyExpense[]>("/emergency-expenses");
}

export async function createEmergencyExpense(
  payload: EmergencyExpensePayload,
) {
  return apiRequest<EmergencyExpense>("/emergency-expenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateEmergencyExpense(
  id: string,
  payload: EmergencyExpensePayload,
) {
  return apiRequest<EmergencyExpense>(`/emergency-expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteEmergencyExpense(id: string) {
  return apiRequest<void>(`/emergency-expenses/${id}`, {
    method: "DELETE",
  });
}