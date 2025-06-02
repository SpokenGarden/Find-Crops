import React, { useState } from "react";

// Helper: clean up section titles
function prettySectionName(section) {
  return section
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function CropCard({ cropName, cropData }) {
  const [expanded, setExpanded] = useState(false);

  // Get all valid sections (arrays of objects), ignoring empty ones
  const sectionNames = Object.keys(cropData).filter(
    (section) =>
      Array.isArray(cropData[section]) &&
      cropData[section].length > 0
  );

  // Show first 2 sections when collapsed, all when expanded
  const visibleSections = expanded
    ? sectionNames
    : sectionNames.slice(0, 2);

  return (
    <div
      style={{
        border: "2px solid #d1e7dd",
        background: "#f8f9fa",
        borderRadius: 10,
        marginBottom: 8,
        boxShadow: "0 2px 8px #eee",
        padding: "16px 20px",
        transition: "box-shadow 0.2s",
        position: "relative"
      }}
    >
      <h3 style={{ marginTop: 0, color: "#2d6a4f" }}>{cropName}</h3>

      {visibleSections.map((section) => (
        <div key={section} style={{ marginBottom: 8 }}>
          <h4 style={{ margin: "8px 0 4px 0", color: "#4a4a4a", fontSize: "1.05rem" }}>
            {prettySectionName(section)}
          </h4>
          <ul style={{ margin: 0, paddingLeft: "1em" }}>
            {cropData[section].map((item, idx) => (
              <li key={idx} style={{ fontSize: "0.97rem" }}>
                <strong>{item.label}:</strong> {item.value}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Expand/Collapse Button */}
      {sectionNames.length > 2 && (
        <button
          style={{
            marginTop: 10,
            border: "none",
            background: "#e9ecef",
            color: "#2d6a4f",
            borderRadius: 6,
            padding: "4px 14px",
            fontSize: "0.96rem",
            cursor: "pointer",
            outline: "none",
            transition: "background 0.2s"
          }}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show Less" : `Show More (${sectionNames.length - 2} more)`}
        </button>
      )}
    </div>
  );
}
