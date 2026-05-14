import { FinanceProvider } from "./contexts/FinanceContext";
import { AppRoutes } from "./routes";

function App() {
  return (
    <FinanceProvider>
      <AppRoutes />
    </FinanceProvider>
  );
}

export default App;