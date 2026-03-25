import { useState, useEffect } from "react";
import { Office365UsersService } from "../generated/services/Office365UsersService";
import ContactHRModal from "./ContactHRModal";
import "./TopBar.css";

function TopBar() {
  const [userName, setUserName] = useState<string>("Loading...");
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    Office365UsersService.MyProfile()
      .then((result) => {
        const profile = result.data;
        setUserName(profile?.DisplayName || profile?.Mail || "User");
      })
      .catch(() => {
        setUserName("User");
      });
  }, []);

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <span className="top-bar-logo">EY</span>
          <span className="top-bar-divider"></span>
          <span className="top-bar-app-name">Family Leave Planner</span>
        </div>
        <div className="top-bar-right">
          <button
            className="top-bar-hr-button"
            onClick={() => setShowContactModal(true)}
            title="Contact HR Services"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 4C2 3.44772 2.44772 3 3 3H17C17.5523 3 18 3.44772 18 4V14C18 14.5523 17.5523 15 17 15H11L7 18V15H3C2.44772 15 2 14.5523 2 14V4Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="10" cy="7.5" r="1" fill="currentColor" />
              <rect x="9.25" y="9.5" width="1.5" height="3" rx="0.75" fill="currentColor" />
            </svg>
            <span className="hr-button-text">Contact HR</span>
          </button>
          <div className="top-bar-user">
            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{userName}</span>
          </div>
        </div>
      </div>

      {showContactModal && (
        <ContactHRModal onClose={() => setShowContactModal(false)} />
      )}
    </>
  );
}

export default TopBar;
