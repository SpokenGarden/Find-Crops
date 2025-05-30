import React, { useState } from "react";

// ... (styling and icon code remains the same)

function CropCard({ cropName, cropData }) {
  const [expanded, setExpanded] = useState(false);

  // Combine Basics & Care into one section if both exist
  const hasBasics = cropData["Basics"];
  const hasCare = cropData["Care"];
  let displayData = { ...cropData };
  if (hasBasics || hasCare) {
    displayData = { ...cropData }; // shallow copy
    // Combine fields, both may exist or only one
    const combinedFields = [
      ...(hasBasics ? cropData["Basics"] : []),
      ...(hasCare ? cropData["Care"] : []),
    ];
    // Remove old sections, add new
    delete displayData["Basics"];
    delete displayData["Care"];
    displayData["Basics & Care"] = combinedFields;
  }

  const sectionEntries = Object.entries(displayData);
  const mid = Math.ceil(sectionEntries.length / 2);
  const leftSections = sectionEntries.slice(0, mid);
  const rightSections = sectionEntries.slice(mid);

  // Update default sections
  const DEFAULT_SECTIONS = ["Basics & Care", "Growth"];
  const filteredEntries = expanded
    ? sectionEntries
    : sectionEntries.filter(([section]) => DEFAULT_SECTIONS.includes(section));
  const filteredMid = Math.ceil(filteredEntries.length / 2);
  const filteredLeft = filteredEntries.slice(0, filteredMid);
  const filteredRight = filteredEntries.slice(filteredMid);

  // ... (renderSections and getIconForLabel unchanged)

  // (rest of the component remains unchanged)
}
