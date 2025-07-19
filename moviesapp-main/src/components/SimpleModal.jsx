import React, { useEffect, useState } from "react";

const SimpleModal = ({ show, onClose, title, children }) => {
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      // Trigger animation slightly after mount for transition to take effect
      const timer = setTimeout(() => setContentVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "auto"; // Restore background scrolling
      setContentVisible(false);
    }
    // Cleanup function to restore scrolling when component unmounts while modal is open
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`simple-modal-overlay ${show ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    >
      <div
        className={`simple-modal-content ${
          contentVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="simple-modal-header">
          <h2 className="simple-modal-title">{title || "Modal Title"}</h2>
          <button onClick={onClose} className="simple-modal-close-button">
            &times;
          </button>
        </div>
        <div className="simple-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default SimpleModal;
