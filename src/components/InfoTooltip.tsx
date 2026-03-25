import { useState, useRef, useEffect } from "react";
import "./InfoTooltip.css";

interface InfoTooltipProps {
  children: React.ReactNode;
}

function InfoTooltip({ children }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="info-tooltip-wrapper" ref={ref}>
      <button
        className={`info-tooltip-trigger ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
        type="button"
        aria-label="More information"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="5" r="0.75" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div className="info-tooltip-popup">
          <div className="info-tooltip-arrow" />
          <div className="info-tooltip-content">{children}</div>
        </div>
      )}
    </div>
  );
}

export default InfoTooltip;