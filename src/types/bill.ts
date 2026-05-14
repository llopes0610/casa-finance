export type BillStatus = "pending" | "paid";

export type Bill = {
  id: string;
  description: string;
  amount: number;
  category: string;
  dueDate: string;
  status: BillStatus;
  createdAt?: string;
};