import React from "react";

const BackHomeButton = ({ onClick, style = {} }) => (
  <button
    onClick={onClick || (() => (window.location.href = "https://www.spokengarden.com"))}
    style={{
      display: "inline-block",
      background: "#b7e4c7",
      color: "#155943",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      padding: "0.6rem 1.5rem",
      fontSize: "1rem",
      fontWeight: 500,
      ...style
    }}
  >
    ← Back to Home
  </button>
);

export default BackHomeButton;
