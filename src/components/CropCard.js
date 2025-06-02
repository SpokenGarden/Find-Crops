import React, { useState } from "react";

// Optional: icon helper (customize as you wish)
function getIconForLabel(label) {
  const icons = {
    "Type": "🪴",
    "Sun": "☀️",
    "Water": "💧",
    "Soil": "🪨",
    "Days to Harvest": "🗓️",
    "Days to Maturity or Harvest": "🗓️",
    "Spacing": "📏",
    "Height": "📏",
    "Buy Now": "🛒",
    // Add more as you like!
  };
  return icons[label] || "🔹";
}

// MERGE: Accepts new nested data structure as cropData
export default function CropCard({ cropName, cropData }) {
  const [expanded, setExpanded] = useState(false);

  // Remove Link/Links section for main display, extract Buy Now link if present
  let displayData = { ...cropData };
  let buyNowUrl = "";
  ["Link", "Links"].forEach(linkKey => {
    if (displayData[linkKey]) {
      const linkFields = Array.isArray(displayData[linkKey]) ? displayData[linkKey] : [];
      const buyNowField = linkFields.find(
        (field) =>
          typeof field.label === "string" &&
          field.label.trim().toLowerCase() === "buy now" &&
          typeof field.value === "string" &&
          /^https?:\/\//i.test(field.value.trim())
      );
      if (buyNowField) buyNowUrl = buyNowField.value.trim();
      delete displayData[linkKey];
    }
  });

  // Split sections for two-column layout
  const sectionEntries = Object.entries(displayData);
  const mid = Math.ceil(sectionEntries.length / 2);
  const leftSections = sectionEntries.slice(0, mid);
  const rightSections = sectionEntries.slice(mid);

  // Render all sections dynamically
  function renderSections(sections) {
    return sections.map(([section, fields]) => (
      <div key={section} style={{ marginBottom: "1.2em" }}>
        <h3
          style={{
            margin: "0 0 0.3em 0",
            fontSize: "1.07rem",
            color: "#228B22"
          }}
        >
          {section}
        </h3>
        <ul style={{
          paddingLeft: 0,
          margin: 0,
          listStyle: "none"
        }}>
          {Array.isArray(fields) &&
            fields.map(({ label, value }) => (
              <li key={label} style={{ marginBottom: 6, display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "1.1em", marginRight: 7 }}>{getIconForLabel(label)}</span>
                <span style={{
                  fontWeight: 600,
                  fontSize: "1.23rem",
                  letterSpacing: 0.5,
                  flex: 1
                }}>
                  {label}
                </span>
                <span>{value}</span>
              </li>
            ))}
        </ul>
      </div>
    ));
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f3fcf7 0%, #e6f9ee 100%)",
        borderRadius: "14px",
        boxShadow: "0 4px 16px rgba(34,74,66,0.08)",
        border: "1px solid #d0ede1",
        padding: "1.2rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        position: "relative",
        maxWidth: 700,
        width: "100%",
        minWidth: 0
      }}
    >
      {/* Card header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 12
      }}>
        <span style={{ fontSize: "1.7rem", marginRight: 10 }}>🌱</span>
        <span style={{
          color: "#155943",
          fontWeight: 700,
          fontSize: "1.23rem",
          letterSpacing: 0.5,
          flex: 1
        }}>
          {cropName}
        </span>
      </div>
      {/* Two columns for sections */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.2em",
          width: "100%",
          marginBottom: "0.8em",
        }}
      >
        {renderSections(leftSections)}
        {renderSections(rightSections)}
      </div>
      {/* Buy Now button if exists */}
      {buyNowUrl && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <a
            href={buyNowUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#228B22",
              color: "#fff",
              padding: "0.55em 1.2em",
              borderRadius: "8px",
              border: "none",
              fontWeight: 700,
              fontSize: "1em",
              textDecoration: "none",
              boxShadow: "0 2px 6px rgba(34,74,66,0.08)",
              transition: "background 0.2s"
            }}
          >
            🛒 Buy Now
          </a>
        </div>
      )}
    </div>
  );
}
