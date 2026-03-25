import { HashRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CalculatorPage from "./pages/CalculatorPage";
import ResourcesPage from "./pages/ResourcesPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App
