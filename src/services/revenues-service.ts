import type { Revenue } from "../types/revenue";

import { apiRequest } from "./api";

type RevenuePayload = Omit<Revenue, "id" | "createdAt">;

export async function getRevenues() {
  return apiRequest<Revenue[]>("/revenues");
}

export async function createRevenue(payload: RevenuePayload) {
  return apiRequest<Revenue>("/revenues", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateRevenue(id: string, payload: RevenuePayload) {
  return apiRequest<Revenue>(`/revenues/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteRevenue(id: string) {
  return apiRequest<void>(`/revenues/${id}`, {
    method: "DELETE",
  });
}