import type { Bill } from "../types/bill";

import { apiRequest } from "./api";

type BillPayload = Omit<Bill, "id" | "createdAt">;

export async function getBills() {
  return apiRequest<Bill[]>("/bills");
}

export async function createBill(payload: BillPayload) {
  return apiRequest<Bill>("/bills", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateBill(id: string, payload: BillPayload) {
  return apiRequest<Bill>(`/bills/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function toggleBillStatus(id: string) {
  return apiRequest<Bill>(`/bills/${id}/toggle-status`, {
    method: "PATCH",
  });
}

export async function deleteBill(id: string) {
  return apiRequest<void>(`/bills/${id}`, {
    method: "DELETE",
  });
}