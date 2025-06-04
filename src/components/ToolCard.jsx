import React from "react";

export default function ToolCard({
  name,
  description,
  usage,
  imageUrl,
  buyUrl,
  buttonLabel = "Buy on Amazon"
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "1.5em",
        background: "#f7fcf9",
        border: "1px solid #cdefde",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(34,74,66,0.09)",
        padding: "1.1em 1.3em",
        marginBottom: "1.2em",
        maxWidth: 600
      }}
    >
      {/* Clickable Image */}
      <a
        href={buyUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "block", minWidth: 90 }}
      >
        <img
          src={imageUrl}
          alt={name}
          style={{
            width: 90,
            height: 90,
            objectFit: "contain",
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(34,74,66,0.08)",
            background: "#fff"
          }}
        />
      </a>
      {/* Tool Info */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ margin: "0 0 0.35em 0", color: "#16643a", fontSize: "1.21rem" }}>{name}</h3>
        <div style={{ marginBottom: 6, color: "#375c4b", fontSize: "1rem" }}>{description}</div>
        {usage && (
          <div style={{ marginBottom: 10, color: "#5c765a", fontSize: "0.97rem" }}>
            <strong>Use:</strong> {usage}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "0.47em 1.2em",
              background: "#228B22",
              color: "#fff",
              borderRadius: "7px",
              fontWeight: 700,
              fontSize: "1.01rem",
              textDecoration: "none",
              marginTop: 6,
              boxShadow: "0 2px 6px rgba(34,74,66,0.09)",
              transition: "background 0.2s"
            }}
          >
            {buttonLabel}
          </a>
        </div>
      </div>
    </div>
  );
}