import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { mockBills } from "../data/mock-bills";
import { mockEmergencyExpenses } from "../data/mock-emergency-expenses";
import { mockRevenues } from "../data/mock-revenues";
import { mockSavingGoals } from "../data/mock-saving-goals";

import type { Bill } from "../types/bill";
import type { EmergencyExpense } from "../types/emergency-expense";
import type { Revenue } from "../types/revenue";
import type { SavingGoal } from "../types/saving-goal";

const STORAGE_KEYS = {
  revenues: "@casa-finance:revenues",
  bills: "@casa-finance:bills",
  savingGoals: "@casa-finance:saving-goals",
  emergencyExpenses: "@casa-finance:emergency-expenses",
};

type FinanceContextData = {
  revenues: Revenue[];
  bills: Bill[];
  savingGoals: SavingGoal[];
  emergencyExpenses: EmergencyExpense[];

  totalRevenues: number;
  totalPendingBills: number;
  totalPaidBills: number;
  totalSaved: number;
  totalEmergencyExpenses: number;
  currentBalance: number;

  addRevenue: (revenue: Omit<Revenue, "id">) => void;
  updateRevenue: (id: string, revenue: Omit<Revenue, "id">) => void;
  deleteRevenue: (id: string) => void;

  addBill: (bill: Omit<Bill, "id">) => void;
  updateBill: (id: string, bill: Omit<Bill, "id">) => void;
  deleteBill: (id: string) => void;
  toggleBillStatus: (id: string) => void;

  addSavingGoal: (savingGoal: Omit<SavingGoal, "id">) => void;
  updateSavingGoal: (id: string, savingGoal: Omit<SavingGoal, "id">) => void;
  deleteSavingGoal: (id: string) => void;
  addMoneyToSavingGoal: (id: string, amount: number) => void;

  addEmergencyExpense: (expense: Omit<EmergencyExpense, "id">) => void;
  updateEmergencyExpense: (
    id: string,
    expense: Omit<EmergencyExpense, "id">,
  ) => void;
  deleteEmergencyExpense: (id: string) => void;

  resetFinanceData: () => void;
};

const FinanceContext = createContext({} as FinanceContextData);

type FinanceProviderProps = {
  children: ReactNode;
};

function getStoredData<T>(key: string, fallback: T): T {
  const storedData = localStorage.getItem(key);

  if (!storedData) {
    return fallback;
  }

  try {
    return JSON.parse(storedData) as T;
  } catch {
    return fallback;
  }
}

export function FinanceProvider({ children }: FinanceProviderProps) {
  const [revenues, setRevenues] = useState<Revenue[]>(() =>
    getStoredData(STORAGE_KEYS.revenues, mockRevenues),
  );

  const [bills, setBills] = useState<Bill[]>(() =>
    getStoredData(STORAGE_KEYS.bills, mockBills),
  );

  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>(() =>
    getStoredData(STORAGE_KEYS.savingGoals, mockSavingGoals),
  );

  const [emergencyExpenses, setEmergencyExpenses] = useState<
    EmergencyExpense[]
  >(() =>
    getStoredData(STORAGE_KEYS.emergencyExpenses, mockEmergencyExpenses),
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.revenues, JSON.stringify(revenues));
  }, [revenues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bills, JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.savingGoals,
      JSON.stringify(savingGoals),
    );
  }, [savingGoals]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.emergencyExpenses,
      JSON.stringify(emergencyExpenses),
    );
  }, [emergencyExpenses]);

  const totalRevenues = useMemo(() => {
    return revenues.reduce((total, revenue) => total + revenue.amount, 0);
  }, [revenues]);

  const totalPendingBills = useMemo(() => {
    return bills
      .filter((bill) => bill.status === "pending")
      .reduce((total, bill) => total + bill.amount, 0);
  }, [bills]);

  const totalPaidBills = useMemo(() => {
    return bills
      .filter((bill) => bill.status === "paid")
      .reduce((total, bill) => total + bill.amount, 0);
  }, [bills]);

  const totalSaved = useMemo(() => {
    return savingGoals.reduce((total, goal) => total + goal.currentAmount, 0);
  }, [savingGoals]);

  const totalEmergencyExpenses = useMemo(() => {
    return emergencyExpenses.reduce(
      (total, expense) => total + expense.amount,
      0,
    );
  }, [emergencyExpenses]);

  const currentBalance = useMemo(() => {
    return (
      totalRevenues -
      totalPaidBills -
      totalPendingBills -
      totalEmergencyExpenses -
      totalSaved
    );
  }, [
    totalRevenues,
    totalPaidBills,
    totalPendingBills,
    totalEmergencyExpenses,
    totalSaved,
  ]);

  function addRevenue(revenue: Omit<Revenue, "id">) {
    setRevenues((state) => [
      {
        id: crypto.randomUUID(),
        ...revenue,
      },
      ...state,
    ]);
  }

  function updateRevenue(id: string, revenue: Omit<Revenue, "id">) {
    setRevenues((state) =>
      state.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          id,
          ...revenue,
        };
      }),
    );
  }

  function deleteRevenue(id: string) {
    setRevenues((state) => state.filter((revenue) => revenue.id !== id));
  }

  function addBill(bill: Omit<Bill, "id">) {
    setBills((state) => [
      {
        id: crypto.randomUUID(),
        ...bill,
      },
      ...state,
    ]);
  }

  function updateBill(id: string, bill: Omit<Bill, "id">) {
    setBills((state) =>
      state.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          id,
          ...bill,
        };
      }),
    );
  }

  function deleteBill(id: string) {
    setBills((state) => state.filter((bill) => bill.id !== id));
  }

  function toggleBillStatus(id: string) {
    setBills((state) =>
      state.map((bill) => {
        if (bill.id !== id) {
          return bill;
        }

        return {
          ...bill,
          status: bill.status === "pending" ? "paid" : "pending",
        };
      }),
    );
  }

  function addSavingGoal(savingGoal: Omit<SavingGoal, "id">) {
    setSavingGoals((state) => [
      {
        id: crypto.randomUUID(),
        ...savingGoal,
      },
      ...state,
    ]);
  }

  function updateSavingGoal(id: string, savingGoal: Omit<SavingGoal, "id">) {
    setSavingGoals((state) =>
      state.map((goal) => {
        if (goal.id !== id) {
          return goal;
        }

        return {
          id,
          ...savingGoal,
        };
      }),
    );
  }

  function deleteSavingGoal(id: string) {
    setSavingGoals((state) => state.filter((goal) => goal.id !== id));
  }

  function addMoneyToSavingGoal(id: string, amount: number) {
    if (amount <= 0) {
      return;
    }

    setSavingGoals((state) =>
      state.map((goal) => {
        if (goal.id !== id) {
          return goal;
        }

        return {
          ...goal,
          currentAmount: goal.currentAmount + amount,
        };
      }),
    );
  }

  function addEmergencyExpense(expense: Omit<EmergencyExpense, "id">) {
    setEmergencyExpenses((state) => [
      {
        id: crypto.randomUUID(),
        ...expense,
      },
      ...state,
    ]);
  }

  function updateEmergencyExpense(
    id: string,
    expense: Omit<EmergencyExpense, "id">,
  ) {
    setEmergencyExpenses((state) =>
      state.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          id,
          ...expense,
        };
      }),
    );
  }

  function deleteEmergencyExpense(id: string) {
    setEmergencyExpenses((state) =>
      state.filter((expense) => expense.id !== id),
    );
  }

  function resetFinanceData() {
    localStorage.removeItem(STORAGE_KEYS.revenues);
    localStorage.removeItem(STORAGE_KEYS.bills);
    localStorage.removeItem(STORAGE_KEYS.savingGoals);
    localStorage.removeItem(STORAGE_KEYS.emergencyExpenses);

    setRevenues(mockRevenues);
    setBills(mockBills);
    setSavingGoals(mockSavingGoals);
    setEmergencyExpenses(mockEmergencyExpenses);
  }

  return (
    <FinanceContext.Provider
      value={{
        revenues,
        bills,
        savingGoals,
        emergencyExpenses,

        totalRevenues,
        totalPendingBills,
        totalPaidBills,
        totalSaved,
        totalEmergencyExpenses,
        currentBalance,

        addRevenue,
        updateRevenue,
        deleteRevenue,

        addBill,
        updateBill,
        deleteBill,
        toggleBillStatus,

        addSavingGoal,
        updateSavingGoal,
        deleteSavingGoal,
        addMoneyToSavingGoal,

        addEmergencyExpense,
        updateEmergencyExpense,
        deleteEmergencyExpense,

        resetFinanceData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  return useContext(FinanceContext);
}