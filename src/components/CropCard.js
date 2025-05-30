import React, { useState } from "react";

// Card styling
const cardShadow = "0 4px 16px rgba(34,74,66,0.08)";
const cardBorder = "1px solid #d0ede1";
const cardBg = "linear-gradient(135deg, #f3fcf7 0%, #e6f9ee 100%)";

// Show only these sections by default (customize as needed)
const DEFAULT_SECTIONS = ["Basics & Care", "Growth"];

function CropCard({ cropName, cropData }) {
  const [expanded, setExpanded] = useState(false);

  // Combine Basics & Care into one section if either exists
  const hasBasics = cropData["Basics"];
  const hasCare = cropData["Care"];
  let displayData = { ...cropData };
  if (hasBasics || hasCare) {
    const combinedFields = [
      ...(hasBasics ? cropData["Basics"] : []),
      ...(hasCare ? cropData["Care"] : []),
    ];
    delete displayData["Basics"];
    delete displayData["Care"];
    displayData = {
      "Basics & Care": combinedFields,
      ...displayData,
    };
  }

  // Extract Buy Now URL from Link section and remove Link from displayData
  let buyNowUrl = "";
  if ("Link" in displayData) {
    const linkFields = Array.isArray(displayData["Link"]) ? displayData["Link"] : [];
    // Find field labeled "Buy Now" with a http(s) url
    const buyNowField = linkFields.find(
      (field) =>
        typeof field.label === "string" &&
        field.label.trim().toLowerCase() === "buy now" &&
        typeof field.value === "string" &&
        /^https?:\/\//i.test(field.value.trim())
    );
    if (buyNowField) {
      buyNowUrl = buyNowField.value.trim();
    }
    // Remove Link section from displayData to not render it as a section
    delete displayData["Link"];
  }

  const sectionEntries = Object.entries(displayData);
  const mid = Math.ceil(sectionEntries.length / 2);
  const leftSections = sectionEntries.slice(0, mid);
  const rightSections = sectionEntries.slice(mid);

  // If not expanded, filter for only the default sections (still split evenly)
  const filteredEntries = expanded
    ? sectionEntries
    : sectionEntries.filter(([section]) => DEFAULT_SECTIONS.includes(section));
  const filteredMid = Math.ceil(filteredEntries.length / 2);
  const filteredLeft = filteredEntries.slice(0, filteredMid);
  const filteredRight = filteredEntries.slice(filteredMid);

  // Helper for rendering sections
  function renderSections(sections) {
    return sections.map(([section, fields]) => (
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
              <span style={{ fontSize: "1.1em", marginRight: 7 }}>
                {getIconForLabel(label)}
              </span>
              <span style={{ fontWeight: 600, color: "#22543d", marginRight: 7 }}>{label}:</span>
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
        background: cardBg,
        borderRadius: "14px",
        boxShadow: cardShadow,
        border: cardBorder,
        padding: "1.2rem 1.5rem",
        marginBottom: "1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        position: "relative",
        maxWidth: 700,
        width: "100%",
        minWidth: 0,
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
        {renderSections(expanded ? leftSections : filteredLeft)}
        {renderSections(expanded ? rightSections : filteredRight)}
      </div>
      {/* Show More/Less button if there are hidden sections */}
      {sectionEntries.length > DEFAULT_SECTIONS.length && (
        <button
          style={{
            alignSelf: "center",
            marginTop: 4,
            marginBottom: 2,
            background: "#d0ede1",
            color: "#155943",
            border: "none",
            borderRadius: "8px",
            padding: "0.4em 1em",
            fontSize: "1em",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
      {/* Buy Now button always visible if link exists */}
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
      )}
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
