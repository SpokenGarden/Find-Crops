import React, { useState } from "react";
import { useCropData } from "../hooks/useCropData";

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
export default function CropCard({ cropName }) {
  const [expanded, setExpanded] = useState(false);
  const { cropData, loading, error } = useCropData();

  if (loading) return <div className="crop-card">Loading crop data...</div>;
  if (error) return <div className="crop-card">Error loading crop data: {error.message}</div>;
  if (!cropData || !cropData[cropName]) return <div className="crop-card">No data available for this crop.</div>;

  // Use the cropData for the specific crop
  let displayData = { ...cropData[cropName] };
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

  // Style cropName for italicizing text in parentheses
  const styleCropName = (name) => {
    const match = name.match(/^(.+?)\s\((.+?)\)$/);
    if (!match) return name; // If no parentheses, return name as-is
    const mainName = match[1];
    const italicText = match[2];
    return (
      <>
        {mainName} <span style={{ fontStyle: "italic" }}>({italicText})</span>
      </>
    );
  };

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
      <div key={section} className="crop-card-section">
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
    <div className="crop-card">
      <style>{`
        .crop-card {
          background: linear-gradient(135deg, #f3fcf7 0%, #e6f9ee 100%);
          border-radius: 22px;
          box-shadow: 0 4px 16px rgba(34,74,66,0.08);
          border: 1px solid #d0ede1;
          padding: 1.2rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          position: relative;
          max-width: 700px;
          width: 100%;
          min-width: 0;
          margin: 0 auto 0.8rem auto;
          box-sizing: border-box;
          overflow: visible;
        }
      `}</style>
      {/* Card header */}
      <div className="crop-card-header">
        <span style={{ fontSize: "1.7rem", marginRight: 10 }}>🌱</span>
        <span className="crop-card-title">{styleCropName(cropName)}</span>
      </div>
      {/* Two columns for sections */}
      <div className="crop-card-sections">
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
              borderRadius: 8,
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
              borderRadius: "12px",
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
