import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "./CounterPage.css";

function CounterPage() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="counter-page">
      <TopBar />
      <button className="back-button" onClick={() => navigate("/")}>
        &larr; Back to Home
      </button>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/pages/CounterPage.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default CounterPage;
