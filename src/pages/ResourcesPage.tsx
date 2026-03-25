import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import "./ResourcesPage.css";

const RESOURCES = [
  {
    title: "ROI Maternity Leave Policy",
    url: "https://sfwzprd1-lscwfyff.workzonehr.cfapps.eu20.hana.ondemand.com/site#workzone-home&/groups/qJb3tDGhG1vwG6ExRRTxd5/documents/ChGzr9qa6C7avhgvyMPCUh/slide_viewer",
    description: "Statutory maternity leave entitlements, eligibility criteria, and application process for employees in the Republic of Ireland.",
  },
  {
    title: "ROI Paternity Leave Policy",
    url: "https://sfwzprd1-lscwfyff.workzonehr.cfapps.eu20.hana.ondemand.com/site#workzone-home&/groups/qJb3tDGhG1vwG6ExRRTxd5/documents/xVoSmF5ckFMzQeWCK9iR8k/slide_viewer",
    description: "Statutory paternity leave entitlements, eligibility criteria, and application process for employees in the Republic of Ireland.",
  },
  {
    title: "ROI Parent\u2019s Leave Policy",
    url: "https://sfwzprd1-lscwfyff.workzonehr.cfapps.eu20.hana.ondemand.com/site#workzone-home&/groups/qJb3tDGhG1vwG6ExRRTxd5/documents/BAGlBGpXNuCA3fuCQTCioi/slide_viewer",
    description: "Parent\u2019s leave entitlements per child, including firm contribution details and eligibility requirements.",
  },
  {
    title: "ROI How to Guide (Long Term Time Off)",
    url: "https://sfwzprd1-lscwfyff.workzonehr.cfapps.eu20.hana.ondemand.com/site#workzone-home&/groups/qJb3tDGhG1vwG6ExRRTxd5/documents/tQCDqugqaCAZgBl4tAFz7p/slide_viewer",
    description: "Step-by-step guide for requesting and managing long-term time off, including family leave.",
  },
];

function ResourcesPage() {
  const navigate = useNavigate();

  return (
    <div className="resources-page">
      <TopBar />
      <main className="resources-main">
        <div className="resources-container">
          <button className="back-link" onClick={() => navigate("/")}>
            &larr; Back to Home
          </button>
          <h1 className="resources-title">Resources</h1>
          <p className="resources-subtitle">
            Policies, guides, and reference materials related to family leave in the Republic of Ireland.
          </p>

          <div className="resources-grid">
            {RESOURCES.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-card"
              >
                <div className="resource-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#ffe600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="#ffe600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="#ffe600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="#ffe600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H8" stroke="#ffe600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="resource-info">
                  <h3 className="resource-name">{r.title}</h3>
                  <p className="resource-desc">{r.description}</p>
                </div>
                <div className="resource-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 7H17V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResourcesPage;