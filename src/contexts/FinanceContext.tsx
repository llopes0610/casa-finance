import {
  createContext,
  useCallback,
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

import {
  createBill as createBillRequest,
  deleteBill as deleteBillRequest,
  getBills,
  toggleBillStatus as toggleBillStatusRequest,
  updateBill as updateBillRequest,
} from "../services/bills-service";

import {
  createEmergencyExpense as createEmergencyExpenseRequest,
  deleteEmergencyExpense as deleteEmergencyExpenseRequest,
  getEmergencyExpenses,
  updateEmergencyExpense as updateEmergencyExpenseRequest,
} from "../services/emergency-expenses-service";

import {
  createRevenue as createRevenueRequest,
  deleteRevenue as deleteRevenueRequest,
  getRevenues,
  updateRevenue as updateRevenueRequest,
} from "../services/revenues-service";

import {
  addMoneyToSavingGoal as addMoneyToSavingGoalRequest,
  createSavingGoal as createSavingGoalRequest,
  deleteSavingGoal as deleteSavingGoalRequest,
  getSavingGoals,
  updateSavingGoal as updateSavingGoalRequest,
} from "../services/saving-goals-service";

type FinanceContextData = {
  revenues: Revenue[];
  bills: Bill[];
  savingGoals: SavingGoal[];
  emergencyExpenses: EmergencyExpense[];

  isLoadingFinanceData: boolean;

  totalRevenues: number;
  totalPendingBills: number;
  totalPaidBills: number;
  totalSaved: number;
  totalEmergencyExpenses: number;
  currentBalance: number;

  addRevenue: (revenue: Omit<Revenue, "id" | "createdAt">) => Promise<void>;
  updateRevenue: (
    id: string,
    revenue: Omit<Revenue, "id" | "createdAt">,
  ) => Promise<void>;
  deleteRevenue: (id: string) => Promise<void>;

  addBill: (bill: Omit<Bill, "id" | "createdAt">) => Promise<void>;
  updateBill: (
    id: string,
    bill: Omit<Bill, "id" | "createdAt">,
  ) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  toggleBillStatus: (id: string) => Promise<void>;

  addSavingGoal: (
    savingGoal: Omit<SavingGoal, "id" | "createdAt">,
  ) => Promise<void>;
  updateSavingGoal: (
    id: string,
    savingGoal: Omit<SavingGoal, "id" | "createdAt">,
  ) => Promise<void>;
  deleteSavingGoal: (id: string) => Promise<void>;
  addMoneyToSavingGoal: (id: string, amount: number) => Promise<void>;

  addEmergencyExpense: (
    expense: Omit<EmergencyExpense, "id" | "createdAt">,
  ) => Promise<void>;
  updateEmergencyExpense: (
    id: string,
    expense: Omit<EmergencyExpense, "id" | "createdAt">,
  ) => Promise<void>;
  deleteEmergencyExpense: (id: string) => Promise<void>;

  resetFinanceData: () => Promise<void>;
};

const FinanceContext = createContext({} as FinanceContextData);

type FinanceProviderProps = {
  children: ReactNode;
};

export function FinanceProvider({ children }: FinanceProviderProps) {
  const [revenues, setRevenues] = useState<Revenue[]>(mockRevenues);
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [savingGoals, setSavingGoals] =
    useState<SavingGoal[]>(mockSavingGoals);
  const [emergencyExpenses, setEmergencyExpenses] =
    useState<EmergencyExpense[]>(mockEmergencyExpenses);

  const [isLoadingFinanceData, setIsLoadingFinanceData] = useState(false);

  const loadFinanceData = useCallback(async () => {
    try {
      setIsLoadingFinanceData(true);

      const [
        revenuesData,
        billsData,
        savingGoalsData,
        emergencyExpensesData,
      ] = await Promise.all([
        getRevenues(),
        getBills(),
        getSavingGoals(),
        getEmergencyExpenses(),
      ]);

      setRevenues(revenuesData);
      setBills(billsData);
      setSavingGoals(savingGoalsData);
      setEmergencyExpenses(emergencyExpensesData);
    } catch (error) {
      console.error("Erro ao carregar dados financeiros:", error);
    } finally {
      setIsLoadingFinanceData(false);
    }
  }, []);

  useEffect(() => {
    loadFinanceData();
  }, [loadFinanceData]);

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

  async function addRevenue(revenue: Omit<Revenue, "id" | "createdAt">) {
    const createdRevenue = await createRevenueRequest(revenue);

    setRevenues((state) => [createdRevenue, ...state]);
  }

  async function updateRevenue(
    id: string,
    revenue: Omit<Revenue, "id" | "createdAt">,
  ) {
    const updatedRevenue = await updateRevenueRequest(id, revenue);

    setRevenues((state) =>
      state.map((item) => (item.id === id ? updatedRevenue : item)),
    );
  }

  async function deleteRevenue(id: string) {
    await deleteRevenueRequest(id);

    setRevenues((state) => state.filter((revenue) => revenue.id !== id));
  }

  async function addBill(bill: Omit<Bill, "id" | "createdAt">) {
    const createdBill = await createBillRequest(bill);

    setBills((state) => [createdBill, ...state]);
  }

  async function updateBill(id: string, bill: Omit<Bill, "id" | "createdAt">) {
    const updatedBill = await updateBillRequest(id, bill);

    setBills((state) =>
      state.map((item) => (item.id === id ? updatedBill : item)),
    );
  }

  async function deleteBill(id: string) {
    await deleteBillRequest(id);

    setBills((state) => state.filter((bill) => bill.id !== id));
  }

  async function toggleBillStatus(id: string) {
    const updatedBill = await toggleBillStatusRequest(id);

    setBills((state) =>
      state.map((bill) => (bill.id === id ? updatedBill : bill)),
    );
  }

  async function addSavingGoal(
    savingGoal: Omit<SavingGoal, "id" | "createdAt">,
  ) {
    const createdSavingGoal = await createSavingGoalRequest(savingGoal);

    setSavingGoals((state) => [createdSavingGoal, ...state]);
  }

  async function updateSavingGoal(
    id: string,
    savingGoal: Omit<SavingGoal, "id" | "createdAt">,
  ) {
    const updatedSavingGoal = await updateSavingGoalRequest(id, savingGoal);

    setSavingGoals((state) =>
      state.map((goal) => (goal.id === id ? updatedSavingGoal : goal)),
    );
  }

  async function deleteSavingGoal(id: string) {
    await deleteSavingGoalRequest(id);

    setSavingGoals((state) => state.filter((goal) => goal.id !== id));
  }

  async function addMoneyToSavingGoal(id: string, amount: number) {
    if (amount <= 0) {
      return;
    }

    const updatedSavingGoal = await addMoneyToSavingGoalRequest(id, amount);

    setSavingGoals((state) =>
      state.map((goal) => (goal.id === id ? updatedSavingGoal : goal)),
    );
  }

  async function addEmergencyExpense(
    expense: Omit<EmergencyExpense, "id" | "createdAt">,
  ) {
    const createdEmergencyExpense =
      await createEmergencyExpenseRequest(expense);

    setEmergencyExpenses((state) => [createdEmergencyExpense, ...state]);
  }

  async function updateEmergencyExpense(
    id: string,
    expense: Omit<EmergencyExpense, "id" | "createdAt">,
  ) {
    const updatedEmergencyExpense = await updateEmergencyExpenseRequest(
      id,
      expense,
    );

    setEmergencyExpenses((state) =>
      state.map((item) =>
        item.id === id ? updatedEmergencyExpense : item,
      ),
    );
  }

  async function deleteEmergencyExpense(id: string) {
    await deleteEmergencyExpenseRequest(id);

    setEmergencyExpenses((state) =>
      state.filter((expense) => expense.id !== id),
    );
  }

  async function resetFinanceData() {
    await loadFinanceData();
  }

  return (
    <FinanceContext.Provider
      value={{
        revenues,
        bills,
        savingGoals,
        emergencyExpenses,

        isLoadingFinanceData,

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