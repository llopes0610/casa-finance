import { Route, Routes } from "react-router-dom";

import { AppLayout } from "./components/layouts/AppLayout";
import { useAuth } from "./contexts/AuthContext";
import { FinanceProvider } from "./contexts/FinanceContext";

import { Bills } from "./pages/Bills";
import { Dashboard } from "./pages/Dashboard";
import { Emergencies } from "./pages/Emergencies";
import { Login } from "./pages/Login";
import { Reports } from "./pages/Reports";
import { Revenues } from "./pages/Revenues";
import { Savings } from "./pages/Savings";
import { Settings } from "./pages/Settings";

export function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <FinanceProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/receitas" element={<Revenues />} />
          <Route path="/contas" element={<Bills />} />
          <Route path="/poupanca" element={<Savings />} />
          <Route path="/emergencias" element={<Emergencies />} />
          <Route path="/relatorios" element={<Reports />} />
          <Route path="/configuracoes" element={<Settings />} />
        </Route>
      </Routes>
    </FinanceProvider>
  );
}