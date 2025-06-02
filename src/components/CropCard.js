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

// Accepts new nested data structure as cropData
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

  // Section order: prefer showing Basics, Sowing, Growth, Harvest, Care, then others
  const preferredOrder = ["Basics", "Sowing", "Growth", "Harvest", "Care"];
  const allSections = Object.keys(displayData);
  const sortedSectionEntries = [
    ...preferredOrder
      .map(section => [section, displayData[section]])
      .filter(([section, data]) => Array.isArray(data) && data.length > 0),
    ...allSections
      .filter(section => !preferredOrder.includes(section))
      .map(section => [section, displayData[section]])
      .filter(([section, data]) => Array.isArray(data) && data.length > 0)
  ];

  // Collapse logic: show first 2 sections in collapsed mode, all when expanded
  const defaultSectionsToShow = 2;
  const visibleSectionEntries = expanded
    ? sortedSectionEntries
    : sortedSectionEntries.slice(0, defaultSectionsToShow);

  // Split sections for two-column layout
  const mid = Math.ceil(visibleSectionEntries.length / 2);
  const leftSections = visibleSectionEntries.slice(0, mid);
  const rightSections = visibleSectionEntries.slice(mid);

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
      {/* Expand/Collapse Button */}
      {sortedSectionEntries.length > defaultSectionsToShow && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
          <button
            onClick={() => setExpanded(v => !v)}
            style={{
              background: "#e9ecef",
              color: "#155943",
              border: "none",
              borderRadius: 6,
              padding: "4px 14px",
              fontSize: "0.96rem",
              cursor: "pointer",
              outline: "none",
              fontWeight: 600,
              boxShadow: "0 2px 6px rgba(34,74,66,0.08)",
              marginBottom: 4,
              transition: "background 0.2s"
            }}
          >
            {expanded
              ? "Show Less"
              : `Show More (${sortedSectionEntries.length - defaultSectionsToShow} more)`}
          </button>
        </div>
      )}
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
