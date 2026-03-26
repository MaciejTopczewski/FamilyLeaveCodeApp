import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactWebChat, { createDirectLine } from "botframework-webchat";
import TopBar from "../components/TopBar";
import "./CopilotPage.css";

const TOKEN_ENDPOINT =
  "https://b4dfe969503ae13cb7bbb59ead04ac.ac.environment.api.powerplatform.com/copilotstudio/dataverse-backed/authenticated/bots/eyi_FamilyLeavePolicyAdvisor/conversations?api-version=2022-03-01-preview";

function CopilotPage() {
  const navigate = useNavigate();
  const [directLine, setDirectLine] = useState<ReturnType<typeof createDirectLine> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      try {
        const res = await fetch(TOKEN_ENDPOINT, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Token request failed: ${res.status}`);
        const data = await res.json();
        const token = data.token;
        if (!token) throw new Error("No token returned");

        setDirectLine(createDirectLine({ token }));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to connect";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="copilot-page">
      <TopBar />
      <main className="copilot-main">
        <div className="copilot-container">
          <button className="back-link" onClick={() => navigate("/")}>
            &larr; Back to Home
          </button>
          <h1 className="copilot-title">Family Leave Policy Advisor</h1>
          <p className="copilot-subtitle">
            Ask questions about maternity, paternity, and parent's leave
            policies. This AI advisor can help you understand your entitlements
            and the application process.
          </p>

          <div className="copilot-chat-wrapper">
            {loading && (
              <div className="copilot-loading">
                <div className="loading-spinner" />
                <p>Connecting to advisor...</p>
              </div>
            )}
            {error && (
              <div className="copilot-error">
                <p>Unable to connect to the advisor.</p>
                <p className="error-detail">{error}</p>
                <button
                  className="ey-button secondary"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            )}
            {directLine && (
              <ReactWebChat
                directLine={directLine}
                styleOptions={{
                  backgroundColor: "#2e2e38",
                  bubbleBackground: "#3a3a44",
                  bubbleTextColor: "rgba(255,255,255,0.9)",
                  bubbleFromUserBackground: "#ffe600",
                  bubbleFromUserTextColor: "#2e2e38",
                  sendBoxBackground: "#3a3a44",
                  sendBoxTextColor: "#ffffff",
                  sendBoxButtonColor: "#ffe600",
                  sendBoxButtonColorOnHover: "#ffd700",
                  sendBoxPlaceholderColor: "rgba(255,255,255,0.4)",
                  suggestedActionBackground: "transparent",
                  suggestedActionBorderColor: "#ffe600",
                  suggestedActionTextColor: "#ffe600",
                  rootHeight: "100%",
                  rootWidth: "100%",
                  hideUploadButton: true,
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CopilotPage;