import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { MicrosoftCopilotStudioService } from "../generated/services/MicrosoftCopilotStudioService";
import "./CopilotPage.css";

const AGENT_NAME = "eyi_FamilyLeavePolicyAdvisor";
const NOTIFICATION_URL = "https://notificationurlplaceholder";
const ENVIRONMENT_ID = "b4dfe969-503a-e13c-b7bb-b59ead04acac";

interface ChatMessage {
  role: "user" | "agent";
  text: string;
}

function parseAgentResponse(result: unknown): { text: string; conversationId?: string } {
  const data = (result as Record<string, unknown>)?.data ?? result;
  const d = data as Record<string, unknown> | undefined;
  if (!d) return { text: "No response received." };

  const convId =
    (d.conversationId as string) ??
    (d.ConversationId as string) ??
    (d.conversationID as string) ??
    undefined;

  const responses = (d.responses as string[]) ?? [];
  const lastResponse = (d.lastResponse as string) ?? "";
  const text =
    responses.length > 0 ? responses.join("\n\n") : lastResponse || "No response received.";

  return { text, conversationId: convId };
}

function CopilotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [error, setError] = useState("");
  const [initializing, setInitializing] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // Send initial greeting to trigger agent's welcome topic
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      try {
        const result = await MicrosoftCopilotStudioService.ExecuteCopilotAsyncV2(
          AGENT_NAME,
          { message: "Hi", notificationUrl: NOTIFICATION_URL },
          undefined,
          ENVIRONMENT_ID
        );
        const parsed = parseAgentResponse(result);
        if (parsed.conversationId) setConversationId(parsed.conversationId);
        if (parsed.text && parsed.text !== "No response received.") {
          setMessages([{ role: "agent", text: parsed.text }]);
        }
      } catch {
        // Agent greeting failed silently -- user can still type
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setSending(true);

    try {
      const result = await MicrosoftCopilotStudioService.ExecuteCopilotAsyncV2(
        AGENT_NAME,
        { message: text, notificationUrl: NOTIFICATION_URL },
        conversationId,
        ENVIRONMENT_ID
      );
      const parsed = parseAgentResponse(result);
      if (parsed.conversationId) setConversationId(parsed.conversationId);
      setMessages((prev) => [...prev, { role: "agent", text: parsed.text }]);
    } catch {
      setError("Failed to get a response. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
            <div className="chat-messages">
              {messages.length === 0 && !sending && !initializing && (
                <div className="chat-empty">
                  <div className="chat-empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.663 3.04094 17.0829 4.73812 18.875L2.72681 21.1705C2.44361 21.4937 2.67314 22 3.10288 22H12Z" stroke="#ffe600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 12H8.01" stroke="#ffe600" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M12 12H12.01" stroke="#ffe600" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M16 12H16.01" stroke="#ffe600" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p>Ask me anything about family leave policies.</p>
                  <p className="chat-empty-hint">
                    e.g. "How many weeks of maternity leave am I entitled to?" or "What is parent's leave?"
                  </p>
                </div>
              )}
              {initializing && messages.length === 0 && (
                <div className="chat-empty">
                  <div className="loading-spinner" />
                  <p>Connecting to Policy Advisor...</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.role}`}>
                  <div className="bubble-label">
                    {msg.role === "user" ? "You" : "Policy Advisor"}
                  </div>
                  <div className="bubble-text">{msg.text}</div>
                </div>
              ))}
              {sending && (
                <div className="chat-bubble agent">
                  <div className="bubble-label">Policy Advisor</div>
                  <div className="bubble-text typing">
                    <span className="dot" /><span className="dot" /><span className="dot" />
                  </div>
                </div>
              )}
              {error && <div className="chat-error">{error}</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-bar">
              <textarea
                className="chat-input"
                rows={1}
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending || initializing}
              />
              <button
                className="chat-send-btn"
                onClick={handleSend}
                disabled={!input.trim() || sending || initializing}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CopilotPage;