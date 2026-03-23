import { useState } from "react";
import { Office365OutlookService } from "../generated/services/Office365OutlookService";
import { Office365UsersService } from "../generated/services/Office365UsersService";
import "./ContactHRModal.css";

const HR_EMAIL = "maciej.topczewski@gds.ey.com";
const EMAIL_SUBJECT = "Family Leave Enquiry - Employee Query";

interface SenderInfo {
  name: string;
  email: string;
  jobTitle: string;
  department: string;
}

function buildEmailHtml(message: string, sender: SenderInfo): string {
  const escaped = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

  return `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background-color:#2E2E38;padding:24px 32px;border-bottom:4px solid #FFE600;">
    <span style="color:#FFE600;font-size:24px;font-weight:700;letter-spacing:2px;">EY</span>
    <span style="color:rgba(255,255,255,0.4);margin:0 12px;">|</span>
    <span style="color:rgba(255,255,255,0.8);font-size:14px;">Family Leave Calculator</span>
  </div>
  <div style="background-color:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;">
    <h2 style="color:#2E2E38;font-size:18px;margin:0 0 8px;font-weight:600;">Family Leave Enquiry</h2>
    <p style="color:#6C6C6C;font-size:13px;margin:0 0 20px;border-bottom:1px solid #eee;padding-bottom:16px;">
      This message was sent via the Family Leave Calculator app.
    </p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;background-color:#FAFAFA;border:1px solid #eee;border-radius:4px;" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">
          <span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">From</span><br/>
          <span style="color:#2E2E38;font-size:14px;font-weight:600;">${sender.name}</span>
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;">
          <span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Email</span><br/>
          <a href="mailto:${sender.email}" style="color:#2E2E38;font-size:14px;text-decoration:none;">${sender.email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 16px;">
          <span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Job Title</span><br/>
          <span style="color:#2E2E38;font-size:14px;">${sender.jobTitle}</span>
        </td>
        <td style="padding:12px 16px;">
          <span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Department</span><br/>
          <span style="color:#2E2E38;font-size:14px;">${sender.department}</span>
        </td>
      </tr>
    </table>
    <p style="color:#888;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px;">Message</p>
    <div style="background-color:#F9F9F9;border-left:4px solid #FFE600;padding:16px 20px;margin-bottom:24px;border-radius:0 4px 4px 0;">
      <p style="color:#2E2E38;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap;">${escaped}</p>
    </div>
  </div>
  <div style="background-color:#F5F5F5;padding:16px 32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 4px 4px;">
    <p style="color:#999;font-size:11px;margin:0;line-height:1.5;">
      This is an automated message from the EY Family Leave Calculator.
      To respond to this enquiry, please reply directly to the sender at <a href="mailto:${sender.email}" style="color:#999;">${sender.email}</a>.
    </p>
  </div>
</div>`;
}

interface ContactHRModalProps {
  onClose: () => void;
}

function ContactHRModal({ onClose }: ContactHRModalProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    setError("");

    try {
      const profileResult = await Office365UsersService.MyProfile();
      const profile = profileResult.data;
      const sender: SenderInfo = {
        name: profile?.DisplayName || "Unknown",
        email: profile?.Mail || profile?.UserPrincipalName || "Unknown",
        jobTitle: profile?.JobTitle || "Not specified",
        department: profile?.Department || "Not specified",
      };

      await Office365OutlookService.SendEmailV2({
        To: HR_EMAIL,
        Subject: `${EMAIL_SUBJECT} - ${sender.name}`,
        Body: buildEmailHtml(message, sender),
        Importance: "Normal",
      });
      setSent(true);
      setTimeout(() => onClose(), 2000);
    } catch {
      setError("Failed to send email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleDiscard = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Contact HR Services</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {sent ? (
          <div className="modal-body">
            <div className="sent-confirmation">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="24" cy="24" r="20" fill="#ffe600" opacity="0.2" />
                <path
                  d="M16 24L22 30L34 18"
                  stroke="#ffe600"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>Your message has been sent to HR Services.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="modal-body">
              <p className="modal-info">
                Send a message to HR Services regarding your family leave query.
                Your message will be sent directly from your mailbox.
              </p>

              {error && <p className="modal-error">{error}</p>}

              <div className="form-group">
                <label htmlFor="hr-to">To</label>
                <input
                  id="hr-to"
                  type="text"
                  value={HR_EMAIL}
                  disabled
                  className="form-input disabled"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hr-subject">Subject</label>
                <input
                  id="hr-subject"
                  type="text"
                  value={EMAIL_SUBJECT}
                  disabled
                  className="form-input disabled"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hr-message">Message</label>
                <textarea
                  id="hr-message"
                  className="form-textarea"
                  rows={6}
                  placeholder="Type your query here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-button discard"
                onClick={handleDiscard}
              >
                Discard
              </button>
              <button
                className="modal-button send"
                onClick={handleSend}
                disabled={!message.trim() || sending}
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ContactHRModal;