import React, { useState } from "react";
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

// Main CropSearch component with "Crop Name Search" at the top
const cardShadow = "0 4px 16px rgba(34,74,66,0.08)";
const cardBorder = "1px solid #d0ede1";
const cardBg = "linear-gradient(135deg, #f3fcf7 0%, #e6f9ee 100%)";

const CropSearch = ({
  crops,
  growZone,
  setGrowZone,
  sun,
  setSun,
  water,
  setWater,
  soil,
  setSoil,
  type,
  setType,
  // ...other filter props here
  // props for more filters if you have them
}) => {
  // Add state for crop name search
  const [cropNameSearch, setCropNameSearch] = useState("");

  // --- UI: Crop Name Search at the top ---
  // (You can move this input to a subcomponent or style as needed)
  const cropNameSearchInput = (
    <div style={{ marginBottom: "1.5em" }}>
      <label htmlFor="crop-name-search" style={{ fontWeight: 700, display: "block", marginBottom: 4 }}>
        Crop Name Search
      </label>
      <input
        id="crop-name-search"
        type="text"
        placeholder="Type a crop name (e.g. radish, zinnia)…"
        value={cropNameSearch}
        onChange={e => setCropNameSearch(e.target.value)}
        className="crop-search-input"
        style={{
          width: "100%",
          maxWidth: "400px",
          fontSize: "1.12rem",
          padding: "0.65em 1em",
          border: "2px solid #228b22",
          borderRadius: "9px",
          outline: "none",
          background: "#f3fcf7",
          color: "#155943",
          boxShadow: "0 2px 10px rgba(34,74,66,0.06)",
          marginBottom: "1.2em"
        }}
        autoFocus
      />
    </div>
  );

  // --- UI: Other filters (Grow Zone, Sun, Water, Soil, Type, etc) ---
  // Replace the below with your actual UI for each filter you have!
  const allOtherFilters = (
    <div className="other-filters" style={{ marginBottom: "2em" }}>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="grow-zone-input" style={{ fontWeight: 600, marginRight: 8 }}>Grow Zone:</label>
        <input
          id="grow-zone-input"
          type="text"
          value={growZone}
          onChange={e => setGrowZone(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="sun-input" style={{ fontWeight: 600, marginRight: 8 }}>Sun:</label>
        <input
          id="sun-input"
          type="text"
          value={sun}
          onChange={e => setSun(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="water-input" style={{ fontWeight: 600, marginRight: 8 }}>Water:</label>
        <input
          id="water-input"
          type="text"
          value={water}
          onChange={e => setWater(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="soil-input" style={{ fontWeight: 600, marginRight: 8 }}>Soil:</label>
        <input
          id="soil-input"
          type="text"
          value={soil}
          onChange={e => setSoil(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="type-input" style={{ fontWeight: 600, marginRight: 8 }}>Type:</label>
        <input
          id="type-input"
          type="text"
          value={type}
          onChange={e => setType(e.target.value)}
        />
      </div>
      {/* Add more filter inputs here as needed */}
    </div>
  );

  // --- Filtering Logic ---
  let cropEntries = Object.entries(crops || {});

  if (cropNameSearch.trim()) {
    // Only filter by crop name if cropNameSearch is filled
    const lower = cropNameSearch.toLowerCase();
    cropEntries = cropEntries.filter(([cropName]) =>
      cropName.toLowerCase().includes(lower)
    );
  } else {
    // Otherwise, use all the other filters (example logic below, expand as needed)
    cropEntries = cropEntries.filter(([cropName, cropData]) => {
      // Check each filter; if empty, ignore that filter.
      let match = true;
      if (growZone && cropData["Grow Zone"]) {
        // You may need to adjust field accessing per your data structure
        const zones = Array.isArray(cropData["Grow Zone"])
          ? cropData["Grow Zone"].map(f => f.value.toLowerCase())
          : [];
        if (!zones.some(z => z.includes(growZone.toLowerCase()))) match = false;
      }
      if (sun && cropData["Sun Requirement"]) {
        const suns = Array.isArray(cropData["Sun Requirement"])
          ? cropData["Sun Requirement"].map(f => f.value.toLowerCase())
          : [];
        if (!suns.some(s => s.includes(sun.toLowerCase()))) match = false;
      }
      if (water && cropData["Water Need"]) {
        const waters = Array.isArray(cropData["Water Need"])
          ? cropData["Water Need"].map(f => f.value.toLowerCase())
          : [];
        if (!waters.some(w => w.includes(water.toLowerCase()))) match = false;
      }
      if (soil && cropData["Soil Preference"]) {
        const soils = Array.isArray(cropData["Soil Preference"])
          ? cropData["Soil Preference"].map(f => f.value.toLowerCase())
          : [];
        if (!soils.some(s => s.includes(soil.toLowerCase()))) match = false;
      }
      if (type && cropData["Type"]) {
        const types = Array.isArray(cropData["Type"])
          ? cropData["Type"].map(f => f.value.toLowerCase())
          : [];
        if (!types.some(t => t.includes(type.toLowerCase()))) match = false;
      }
      // Add other filter checks here as needed
      return match;
    });
  }

  // --- UI Render ---
  if (!cropEntries.length) {
    return (
      <div className="crop-search-container">
        {cropNameSearchInput}
        <div style={{textAlign:"center", fontWeight:600, margin:"1em 0"}}>— OR —</div>
        {allOtherFilters}
        <div style={{ color: "#888", fontSize: "1.2em" }}>No crops found.</div>
      </div>
    );
  }

  return (
    <div className="crop-search-container">
      {cropNameSearchInput}
      <div style={{textAlign:"center", fontWeight:600, margin:"1em 0"}}>— OR —</div>
      {allOtherFilters}
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
    </div>
  );
};

export default CropSearch;
