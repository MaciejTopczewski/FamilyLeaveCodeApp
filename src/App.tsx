import { HashRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CounterPage from "./pages/CounterPage";
import CalculatorPage from "./pages/CalculatorPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/counter" element={<CounterPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App
