import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppLayout } from "../components/layouts/AppLayout";
import { Bills } from "../pages/Bills";
import { Dashboard } from "../pages/Dashboard";
import { Emergencies } from "../pages/Emergencies";
import { Reports } from "../pages/Reports";
import { Revenues } from "../pages/Revenues";
import { Savings } from "../pages/Savings";
import { Settings } from "../pages/Settings";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="receitas" element={<Revenues />} />
          <Route path="contas-a-pagar" element={<Bills />} />
          <Route path="poupanca" element={<Savings />} />
          <Route path="emergencias" element={<Emergencies />} />
          <Route path="relatorios" element={<Reports />} />
          <Route path="configuracoes" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}