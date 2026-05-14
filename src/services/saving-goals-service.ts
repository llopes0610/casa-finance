import type { SavingGoal } from "../types/saving-goal";

import { apiRequest } from "./api";

type SavingGoalPayload = Omit<SavingGoal, "id" | "createdAt">;

export async function getSavingGoals() {
  return apiRequest<SavingGoal[]>("/saving-goals");
}

export async function createSavingGoal(payload: SavingGoalPayload) {
  return apiRequest<SavingGoal>("/saving-goals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateSavingGoal(
  id: string,
  payload: SavingGoalPayload,
) {
  return apiRequest<SavingGoal>(`/saving-goals/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function addMoneyToSavingGoal(id: string, amount: number) {
  return apiRequest<SavingGoal>(`/saving-goals/${id}/add-money`, {
    method: "PATCH",
    body: JSON.stringify({ amount }),
  });
}

export async function deleteSavingGoal(id: string) {
  return apiRequest<void>(`/saving-goals/${id}`, {
    method: "DELETE",
  });
}