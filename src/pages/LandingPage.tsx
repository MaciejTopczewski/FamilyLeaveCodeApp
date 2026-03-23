import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <TopBar />

      <main className="landing-main">
        <div className="landing-hero">
          <div className="hero-graphic">
            <div className="graphic-circle circle-1"></div>
            <div className="graphic-circle circle-2"></div>
            <div className="graphic-circle circle-3"></div>
            <div className="hero-icon">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M40 10C28 10 18 18 14 30C10 42 14 56 24 64C34 72 50 72 60 64C70 56 74 42 70 30C66 18 56 10 40 10Z"
                  fill="#FFE600"
                  opacity="0.3"
                />
                <circle cx="30" cy="35" r="8" fill="#2E2E38" />
                <circle cx="50" cy="35" r="8" fill="#2E2E38" />
                <circle cx="40" cy="55" r="6" fill="#2E2E38" />
                <path
                  d="M22 35C22 35 26 28 30 28C34 28 38 35 38 35"
                  stroke="#FFE600"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M42 35C42 35 46 28 50 28C54 28 58 35 58 35"
                  stroke="#FFE600"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          <h1 className="landing-title">Family Leave Calculator</h1>

          <div className="landing-description">
            <p className="welcome-text">
              Welcome to the new planner of Family Leave dates!
            </p>
            <p>
              The Family Leave Planner is a helpful planning tool designed to
              support employees who are preparing for Maternity or Paternity
              Leave. It allows you to review and estimate key leave dates,
              including your expected leave start date and provisional return to
              work date, based on the information you enter.
            </p>
            <p className="disclaimer">
              This calculator is intended for guidance and planning purposes
              only. While it can help you understand how your leave may look, it
              does not replace the formal family leave request process.
            </p>
            <p>
              All employees are still required to submit a standard family leave
              request in line with firm policies. Official leave approvals,
              entitlements, and confirmations will continue to be managed in
              accordance with policy.
            </p>
            <p>
              If you have questions about your eligibility or the formal
              application process, please refer to the relevant family leave
              policy or contact HR Services.
            </p>
          </div>

          <div className="landing-actions">
            <button
              className="ey-button primary"
              onClick={() => navigate("/calculator")}
            >
              Open Calculator
            </button>
            <button
              className="ey-button secondary"
              onClick={() => navigate("/counter")}
            >
              Counter Demo
            </button>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} EY. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
