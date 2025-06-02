import React from "react";
import './CropSearchResults.css';

// Optional: icon helper for common labels
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
    "Days to Maturity or Harvest": "⏳",
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

// Helper to render all sections and their fields, fully dynamic
function renderSections(cropData) {
  // Remove "Link" or "Links" from display
  const displaySections = Object.entries(cropData).filter(
    ([section]) => section !== "Link" && section !== "Links"
  );

  if (displaySections.length === 0) {
    return <div style={{ color: "#888" }}>No details available.</div>;
  }

  return (
    <div className="fields-grid" style={{ display: "grid", gap: "0.4em 1em" }}>
      {displaySections.map(([section, fields]) => (
        <div key={section}>
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
            {Array.isArray(fields) && fields.map(({ label, value }, idx) => (
              <li key={label + idx} style={{ marginBottom: 6, display: "flex", alignItems: "center" }}>
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

// Main CropResults component
const cardShadow = "0 4px 16px rgba(34,74,66,0.08)";
const cardBorder = "1px solid #d0ede1";
const cardBg = "linear-gradient(135deg, #f3fcf7 0%, #e6f9ee 100%)";

const CropResults = ({ crops }) => {
  // crops: [{ name, ...cropData }], or { [name]: cropData }
  // We'll support both array and object input for compatibility

  // Normalize crops to array of [name, data]
  let cropEntries = [];
  if (Array.isArray(crops)) {
    cropEntries = crops.map((c, i) =>
      [c.Crop || c.name || `Crop ${i + 1}`, c]
    );
  } else if (typeof crops === "object" && crops !== null) {
    cropEntries = Object.entries(crops);
  }

  return (
    <div>
      <div className="crops-grid">
        {cropEntries.length === 0 && (
          <div style={{ color: "#888", fontSize: "1.2em", marginTop: "2em" }}>
            No crops found.
          </div>
        )}
        {cropEntries.map(([cropName, cropData], index) => {
          // Extract Buy Now URL if present in Link or Links field
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
              key={cropName + index}
              style={{
                background: cardBg,
                borderRadius: "14px",
                boxShadow: cardShadow,
                border: cardBorder,
                padding: "1.2rem 1.5rem",
                marginBottom: "1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                transition: "box-shadow 0.2s, transform 0.15s",
                position: "relative",
                maxWidth: 700,
                marginLeft: "auto",
                marginRight: "auto"
              }}
              tabIndex={0}
              aria-label={cropName}
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
              {renderSections(cropData)}
              {buyNowUrl &&
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
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: "1em",
                      boxShadow: "0 2px 6px rgba(34,74,66,0.08)",
                      transition: "background 0.2s",
                      marginLeft: 8,
                      display: "inline-block"
                    }}
                  >
                    Buy Now
                  </a>
                </div>
              }
            </div>
          );
        })}
      </div>
      {/* Calendar button remains below */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          style={{
            marginTop: "2.5rem",
            backgroundColor: "#40916c",
            color: "white",
            padding: "0.85rem 2rem",
            border: "none",
            borderRadius: "8px",
            fontSize: "1.1rem",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(64,145,108,0.10)",
            cursor: cropEntries && cropEntries.length > 0 ? "pointer" : "not-allowed",
            opacity: cropEntries && cropEntries.length > 0 ? 1 : 0.65,
            letterSpacing: 0.3
          }}
          onClick={() => window.open('calendar.html', '_blank')}
          disabled={!cropEntries || cropEntries.length === 0}
          title={
            !cropEntries || cropEntries.length === 0
              ? "Run a search first to see the calendar"
              : undefined
          }
        >
          📆 Show Sowing Calendar
        </button>
      </div>
    </div>
  );
};

export default CropResults;