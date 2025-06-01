import React from "react";
import BackHomeButton from "./BackHomeButton";

const toolsList = [
  { name: "Hand Trowel", description: "Great for digging small holes, transplanting, and removing weeds." },
  { name: "Pruning Shears", description: "Essential for trimming and shaping plants and shrubs." },
  { name: "Watering Can", description: "For gentle, accurate watering." },
  { name: "Gardening Gloves", description: "Protect your hands from dirt and thorns." },
  // Add more tools or supplies as needed!
];

const ToolsAndSupplies = ({ onBack }) => (
  <div
    style={{
      maxWidth: 600,
      margin: "2rem auto",
      padding: "2rem",
      background: "#f9f9f6",
      borderRadius: 16,
      position: "relative",
      minHeight: 400,
    }}
  >
    {/* Top Left */}
    <div style={{ position: "absolute", top: 20, left: 20 }}>
      <BackHomeButton onClick={onBack} />
    </div>
    <h2 style={{ color: "#22543d", marginTop: 0, textAlign: "center" }}>🛠️ Garden Tools & Supplies</h2>
    <p>Here are some recommended tools and supplies for your garden:</p>
    <ul style={{ textAlign: "left" }}>
      {toolsList.map((tool, idx) => (
        <li key={idx} style={{ marginBottom: 12 }}>
          <strong>{tool.name}</strong>: {tool.description}
        </li>
      ))}
    </ul>
    {/* Bottom */}
    <div style={{ marginTop: "3rem", textAlign: "center" }}>
      <BackHomeButton onClick={onBack} />
    </div>
  </div>
);

export default ToolsAndSupplies;
