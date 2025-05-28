import React from "react";
import './CropSearchResults.css';
// Map of field keys to friendly labels and icons (using emojis for simplicity)
const FIELD_DETAILS = {
  Type: { label: "Type", icon: "📦" },
  Sun_Requirement: { label: "Sun", icon: "🌞" },
  Water_Need: { label: "Water", icon: "💧" },
  Soil_Preference: { label: "Soil", icon: "🪨" },
  Days_to_Harvest: { label: "Days to Harvest", icon: "⏳" },
  Sowing_Depth: { label: "Sowing Depth", icon: "🌱" },
  Spacing: { label: "Spacing", icon: "📏" },
  Height: { label: "Height", icon: "🌿" },
  Color: { label: "Color", icon: "🎨" },
  Notes: { label: "Notes", icon: "📝" },
  Kind: { label: "Kind", icon: "🌼" },
  // Add more as needed
};

const getFieldDisplay = (key, value) => {
  const field = FIELD_DETAILS[key];
  if (!field) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
      <span style={{ fontSize: "1.1em", marginRight: 7 }}>{field.icon}</span>
      <span style={{ fontWeight: 600, color: "#22543d" }}>{field.label}:</span>
      <span style={{ marginLeft: 7 }}>{value}</span>
    </div>
  );
};

const getAllFields = (crop) => {
  // Always show fields in the order of FIELD_DETAILS, then any others except Link
  const shownKeys = Object.keys(FIELD_DETAILS);
  const cropKeys = Object.keys(crop);
  const orderedKeys = [
    ...shownKeys.filter((key) => cropKeys.includes(key) && key !== "Crop" && key !== "Link"),
    ...cropKeys.filter(
      (key) => !shownKeys.includes(key) && key !== "Crop" && key !== "Link"
    ),
  ];
  return orderedKeys.map((key) => {
    const value = crop[key];
    // For extra (unknown) fields, show with a generic icon and friendly label
    if (!FIELD_DETAILS[key]) {
      return (
        <div key={key} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: "1.1em", marginRight: 7 }}>🔹</span>
          <span style={{ fontWeight: 600, color: "#22543d" }}>
            {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}:
          </span>
          <span style={{ marginLeft: 7 }}>{value}</span>
        </div>
      );
    }
    return <div key={key}>{getFieldDisplay(key, value)}</div>;
  });
};

const cardShadow = "0 4px 16px rgba(34,74,66,0.08)";
const cardBorder = "1px solid #d0ede1";
const cardBg = "linear-gradient(135deg, #f3fcf7 0%, #e6f9ee 100%)";

const CropSearchResults = ({ crops }) => {
  return (
   <div className="crops-grid">
  {crops.map((crop, index) => {
    const link = crop.Link || crop.link;
    const clickable = !!link;
    const CardContent = (
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
          transition: "box-shadow 0.2s, transform 0.15s",
          position: "relative",
          cursor: clickable ? "pointer" : "default",
          outline: "none",
          ...(clickable && {
            boxShadow: "0 4px 24px rgba(34,74,66,0.14)",
            border: "2px solid #95e1c3",
            transition: "box-shadow 0.2s, border 0.2s, transform 0.15s",
          }),
          // Removed minWidth and maxWidth to allow grid sizing
        }}
        tabIndex={clickable ? 0 : -1}
        aria-label={crop.Crop || "Crop card"}
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
            {crop.Crop || "Unnamed Crop"}
          </span>
        </div>
        {/* Add other crop fields here as needed */}
      </div>
    );

    // Wrap in <a> if clickable, else just render the card
    return clickable ? (
      <a
        key={index}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {CardContent}
      </a>
    ) : (
      <div key={index}>{CardContent}</div>
    );
  })}
</div>
          );
          return clickable ? (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                borderRadius: "14px",
              }}
              tabIndex={0}
            >
              {CardContent}
            </a>
          ) : (
            <div key={index}>{CardContent}</div>
          );
        })}
      </div>
      {/* Only the button remains below */}
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
            cursor: crops && crops.length > 0 ? "pointer" : "not-allowed",
            opacity: crops && crops.length > 0 ? 1 : 0.65,
            letterSpacing: 0.3
          }}
          onClick={() => window.open('calendar.html', '_blank')}
          disabled={!crops || crops.length === 0}
          title={
            !crops || crops.length === 0
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

export default CropSearchResults;
