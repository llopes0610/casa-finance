type RevenueRow = {
  id: string;
  description: string;
  amount: number | string;
  category: string;
  date: string;
  created_at: string;
};

type BillRow = {
  id: string;
  description: string;
  amount: number | string;
  category: string;
  due_date: string;
  status: "pending" | "paid";
  created_at: string;
};

type SavingGoalRow = {
  id: string;
  title: string;
  target_amount: number | string;
  current_amount: number | string;
  category: string;
  deadline: string;
  created_at: string;
};

type EmergencyExpenseRow = {
  id: string;
  description: string;
  amount: number | string;
  category: string;
  priority: "low" | "medium" | "high";
  date: string;
  created_at: string;
};

export function mapRevenueFromDatabase(row: RevenueRow) {
  return {
    id: row.id,
    description: row.description,
    amount: Number(row.amount),
    category: row.category,
    date: row.date,
    createdAt: row.created_at,
  };
}

export function mapBillFromDatabase(row: BillRow) {
  return {
    id: row.id,
    description: row.description,
    amount: Number(row.amount),
    category: row.category,
    dueDate: row.due_date,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function mapSavingGoalFromDatabase(row: SavingGoalRow) {
  return {
    id: row.id,
    title: row.title,
    targetAmount: Number(row.target_amount),
    currentAmount: Number(row.current_amount),
    category: row.category,
    deadline: row.deadline,
    createdAt: row.created_at,
  };
}

export function mapEmergencyExpenseFromDatabase(row: EmergencyExpenseRow) {
  return {
    id: row.id,
    description: row.description,
    amount: Number(row.amount),
    category: row.category,
    priority: row.priority,
    date: row.date,
    createdAt: row.created_at,
  };
}