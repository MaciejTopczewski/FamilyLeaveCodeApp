import { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CalculatorPage from "./pages/CalculatorPage";
import ResourcesPage from "./pages/ResourcesPage";
import { Office365UsersService } from "./generated/services/Office365UsersService";
import { FamilyLeavePlanner_CodeApp_SignInsService } from "./generated/services/FamilyLeavePlanner_CodeApp_SignInsService";

function App() {
  useEffect(() => {
    Office365UsersService.MyProfile()
      .then((res) => {
        const email = res.data?.Mail || res.data?.UserPrincipalName || "Unknown";
        FamilyLeavePlanner_CodeApp_SignInsService.create({
          Title: email,
          SignInTimestamp: new Date().toISOString(),
        }).catch(() => {});
      })
      .catch(() => {});
  }, []);

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
