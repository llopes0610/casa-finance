import { Router } from "express";

import {
  createBill,
  deleteBill,
  listBills,
  toggleBillStatus,
  updateBill,
} from "./controllers/bills-controller";

import {
  createEmergencyExpense,
  deleteEmergencyExpense,
  listEmergencyExpenses,
  updateEmergencyExpense,
} from "./controllers/emergency-expenses-controller";

import {
  registerUser,
  loginUser,
} from "./controllers/auth-controller";

import {
  createRevenue,
  deleteRevenue,
  listRevenues,
  updateRevenue,
} from "./controllers/revenues-controller";

import {
  addMoneyToSavingGoal,
  createSavingGoal,
  deleteSavingGoal,
  listSavingGoals,
  updateSavingGoal,
} from "./controllers/saving-goals-controller";

import { authMiddleware } from "./middlewares/auth-middleware";

export const routes = Router();

routes.get("/health", (request, response) => {
  return response.json({
    status: "ok",
    message: "Casa Finance API funcionando",
  });
});

routes.post("/auth/register", registerUser);
routes.post("/auth/login", loginUser);

routes.use(authMiddleware);

routes.get("/revenues", listRevenues);
routes.post("/revenues", createRevenue);
routes.put("/revenues/:id", updateRevenue);
routes.delete("/revenues/:id", deleteRevenue);

routes.get("/bills", listBills);
routes.post("/bills", createBill);
routes.put("/bills/:id", updateBill);
routes.patch("/bills/:id/toggle-status", toggleBillStatus);
routes.delete("/bills/:id", deleteBill);

routes.get("/saving-goals", listSavingGoals);
routes.post("/saving-goals", createSavingGoal);
routes.put("/saving-goals/:id", updateSavingGoal);
routes.patch("/saving-goals/:id/add-money", addMoneyToSavingGoal);
routes.delete("/saving-goals/:id", deleteSavingGoal);

routes.get("/emergency-expenses", listEmergencyExpenses);
routes.post("/emergency-expenses", createEmergencyExpense);
routes.put("/emergency-expenses/:id", updateEmergencyExpense);
routes.delete("/emergency-expenses/:id", deleteEmergencyExpense);