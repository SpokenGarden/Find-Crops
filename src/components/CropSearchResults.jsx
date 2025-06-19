import React from "react";
import "./CropSearchResults.css";
import CropCard from "./CropCard";

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

const CATEGORY_LABELS = {
  flower: "Flowers",
  vegetable: "Vegetables",
  herb: "Herbs",
  bulb: "Bulbs",
};

export default function CropSearchResults({ groupedCrops, expandedGroups, toggleGroup }) {
  // Calculate counts for summary
  const counts = {
    flower: groupedCrops.flower.length,
    vegetable: groupedCrops.vegetable.length,
    herb: groupedCrops.herb.length,
    bulb: groupedCrops.bulb.length,
  };

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="crop-search-container">
      {/* Search summary */}
      {total > 0 && (
        <div style={{ marginTop: "2rem", marginBottom: "1.5rem", color: "#2d6a4f", textAlign: "center" }}>
          <h2 style={{ margin: 0, fontSize: "1.25rem" }}>
            {total} Plant{total !== 1 ? "s" : ""} Found
          </h2>
          <div style={{ marginTop: "0.5rem", fontSize: "1.05rem" }}>
            Flowers: {counts.flower} &nbsp;|&nbsp; Vegetables: {counts.vegetable} &nbsp;|&nbsp; Herbs: {counts.herb} &nbsp;|&nbsp; Bulbs: {counts.bulb}
          </div>
        </div>
      )}

      {/* Grouped Crop Lists as Accordions */}
      {["flower", "vegetable", "herb", "bulb"].map(group => (
        groupedCrops[group].length > 0 && (
          <div key={group} style={{ marginBottom: "2em", width: "100%" }}>
            {/* Accordion Group Header */}
            <div
              onClick={() => toggleGroup(group)}
              tabIndex={0}
              className="gp-group-header"
              style={{ outline: "none" }}
              aria-expanded={expandedGroups[group]}
              role="button"
            >
              <span>
                {CATEGORY_LABELS[group]}
                {" "}({groupedCrops[group].length})
              </span>
              <span style={{ fontSize: "1.2em" }}>
                {expandedGroups[group] ? "▲" : "▼"}
              </span>
            </div>
            {/* Accordion content */}
            {expandedGroups[group] && (
              <ul className="gp-group-list">
                {groupedCrops[group].map(([cropName, cropData]) => (
                  <li key={cropName} className="gp-group-item">
                    <CropCard cropName={cropName} cropData={cropData} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      ))}
      {/* None found */}
      {total === 0 && (
        <div style={{ color: "#b7b7b7", textAlign: "center", marginTop: "2rem" }}>
          No crops found for your search.
        </div>
      )}
    </div>
  );
}
