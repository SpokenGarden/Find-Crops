import React from "react";
import "./CropSearchResults.css";

// Optional: icon helper for common labels (customize as you wish)
function getIconForLabel(label) {
  const icons = {
    "Type": "🪴",
    "Sun": "☀️",
    "Sun Requirement": "☀️",
    "Water": "💧",
    "Water Need": "💧",
    "Soil": "🪨",
    "Soil Preference": "🪨",
    "Days to Harvest": "🗓️",
    "Days to Maturity or Harvest": "🗓️",
    "Spacing": "📏",
    "Height": "📏",
    "Buy Now": "🛒",
    // Add more as desired!
  };
  return icons[label] || "🔹";
}

// Helper to render all sections and their fields, fully dynamic
function renderSections(cropData) {
  // Remove Link/Links sections from display
  const displaySections = Object.entries(cropData).filter(
    ([section]) => section !== "Link" && section !== "Links"
  );

  if (displaySections.length === 0) {
    return (
      <div style={{ color: "#888" }}>No details available.</div>
    );
  }

  return (
    <div className="fields-grid">
      {displaySections.map(([section, fields]) => (
        <div key={section}>
          <h3
            style={{
              margin: "0 0 0.3em 0",
              fontSize: "1.07rem",
              color: "#228B22",
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
              fields.map(({ label, value }, idx) => (
                <li key={label + idx} style={{ marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                  <span style={{ fontSize: "1.1em", marginRight: 7 }}>{getIconForLabel(label)}</span>
                  <span style={{
                    fontWeight: 600,
                    fontSize: "1.05em",
                    letterSpacing: 0.5,
                    marginRight: 7
                  }}>
                    {label}:
                  </span>
                  <span>{value}</span>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Main CropResults component
const cardShadow = "0 4px 16px rgba(34,74,66,0.08)";
const cardBorder = "1px solid #d0ede1";
const cardBg = "linear-gradient(135deg, #f3fcf7 0%, #e6f9ee 100%)";

const CropResults = ({ crops, searchTerm }) => {
  // crops: { cropName: { Section: [{label, value}, ...], ... }, ... }
  // searchTerm: string

  // Normalize crops into [name, data] pairs for display and filter
  let cropEntries = Object.entries(crops || {});

  // Filter crops by searchTerm (in crop name or any field value/label)
  if (searchTerm && searchTerm.trim()) {
    const lower = searchTerm.toLowerCase();
    cropEntries = cropEntries.filter(([cropName, cropData]) => {
      if (cropName.toLowerCase().includes(lower)) return true;
      return Object.values(cropData).some((fields) =>
        fields.some(
          ({ label, value }) =>
            (label && label.toLowerCase().includes(lower)) ||
            (value && value.toLowerCase().includes(lower))
        )
      );
    });
  }

  if (!cropEntries.length) {
    return (
      <div style={{ color: "#888", fontSize: "1.2em" }}>No crops found.</div>
    );
  }

  return (
    <div className="crops-grid">
      {cropEntries.map(([cropName, cropData]) => {
        // Extract first Buy Now link if present
        let buyNowUrl = "";
        ["Link", "Links"].forEach(linkKey => {
          if (cropData[linkKey]) {
            const linkFields = Array.isArray(cropData[linkKey]) ? cropData[linkKey] : [];
            const buyNowField = linkFields.find(
              (field) =>
                typeof field.label === "string" &&
                field.label.trim().toLowerCase() === "buy now" &&
                typeof field.value === "string" &&
                /^https?:\/\//i.test(field.value.trim())
            );
            if (buyNowField) buyNowUrl = buyNowField.value.trim();
          }
        });

        return (
          <div
            key={cropName}
            style={{
              background: cardBg,
              borderRadius: "14px",
              boxShadow: cardShadow,
              border: cardBorder,
              padding: "1.2rem 1.5rem",
              minWidth: 0,
              width: "100%",
              maxWidth: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              marginBottom: "1em",
              position: "relative"
            }}
          >
            {/* Card header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 12
            }}>
              <span style={{ fontSize: "1.4rem", marginRight: 10 }}>🌱</span>
              <span style={{
                color: "#155943",
                fontWeight: 700,
                fontSize: "1.13rem",
                letterSpacing: 0.5,
                flex: 1
              }}>
                {cropName}
              </span>
            </div>
            {renderSections(cropData)}
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
      })}
    </div>
  );
};

export default CropResults;
