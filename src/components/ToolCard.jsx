import React from "react";

// No layout or style changes—just add imageUrl prop support!
export default function ToolCard({ name, description, usage, imageUrl, buyUrl }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 10px rgba(0,0,0,.06)",
      padding: "1.2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: 340,
    }}>
      {/* Only change: add image support above the name */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          style={{
            width: "120px",
            height: "120px",
            objectFit: "contain",
            marginBottom: "1rem",
            borderRadius: "8px",
            background: "#f6f6f6",
          }}
        />
      )}
      <h4 style={{ margin: "0 0 0.5rem 0", textAlign: "center", color: "#22543d" }}>{name}</h4>
      <p style={{ margin: 0, textAlign: "left" }}>{description}</p>
      {usage && (
        <p style={{ margin: "0.5em 0 0 0", fontSize: "0.95em", color: "#666" }}>
          <strong>Use:</strong> {usage}
        </p>
      )}
      {buyUrl && (
        <a
          href={buyUrl}
          style={{
            marginTop: "1rem",
            background: "#40916c",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1.2rem",
            borderRadius: "6px",
            fontSize: "1rem",
            cursor: "pointer",
            textDecoration: "none",
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy Now
        </a>
      )}
    </div>
  );
}
