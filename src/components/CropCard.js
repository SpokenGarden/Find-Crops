import React from "react";

// Card styling adapted from CropSearchResults.jsx
const cardShadow = "0 4px 16px rgba(34,74,66,0.08)";
const cardBorder = "1px solid #d0ede1";
const cardBg = "linear-gradient(135deg, #f3fcf7 0%, #e6f9ee 100%)";

function CropCard({ cropName, cropData }) {
  if (!cropData) return null;

  return (
    <div
      style={{
        background: cardBg,
        borderRadius: "14px",
        boxShadow: cardShadow,
        border: cardBorder,
        padding: "1.2rem 1.5rem",
        marginBottom: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        position: "relative",
        maxWidth: "600px"
      }}
    >
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
          letterSpacing: 0.5
        }}>
          {cropName}
        </span>
      </div>
      {/* Render each section */}
      {Object.entries(cropData).map(([section, fields]) => (
        <div key={section} style={{ marginBottom: "1.2em" }}>
          <h3 style={{
            margin: "0 0 0.3em 0",
            fontSize: "1.07rem",
            color: "#228B22"
          }}>
            {section}
          </h3>
          <ul style={{
            paddingLeft: 0,
            margin: 0,
            listStyle: "none"
          }}>
            {fields.map(({ label, value }) => (
              <li key={label} style={{ marginBottom: 6, display: "flex", alignItems: "center" }}>
                {/* Optionally add an emoji for well-known labels */}
                <span style={{ fontSize: "1.1em", marginRight: 7 }}>
                  {getIconForLabel(label)}
                </span>
                <span style={{ fontWeight: 600, color: "#22543d", marginRight: 7 }}>{label}:</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Helper function to add icons for common labels
function getIconForLabel(label) {
  const icons = {
    "Type": "📦",
    "Sun": "🌞",
    "Sun Requirement": "🌞",
    "Water": "💧",
    "Water Need": "💧",
    "Soil": "🪨",
    "Soil Preference": "🪨",
    "Days to Harvest": "⏳",
    "Sowing Depth": "🌱",
    "Spacing": "📏",
    "Height": "🌿",
    "Color": "🎨",
    "Notes": "📝",
    "Kind": "🌼",
    "Grow Zone": "📍",
    "Seed Treatment": "💦",
    "Sow Indoors": "🏠",
    "Sow Outdoors": "🏡",
    "Harvest Season": "🗓️",
    "Buy Now": "🛒",
  };
  return icons[label] || "🔹";
}

export default CropCard;
