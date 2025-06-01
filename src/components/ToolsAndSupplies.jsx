import React from "react";

const toolsList = [
  { name: "Hand Trowel", description: "Great for digging small holes, transplanting, and removing weeds." },
  { name: "Pruning Shears", description: "Essential for trimming and shaping plants and shrubs." },
  { name: "Watering Can", description: "For gentle, accurate watering." },
  { name: "Gardening Gloves", description: "Protect your hands from dirt and thorns." },
  // Add more tools or supplies as needed!
];

const ToolsAndSupplies = ({ onBack }) => (
  <div style={{ maxWidth: 600, margin: "2rem auto", padding: "2rem", background: "#f9f9f6", borderRadius: 16 }}>
    <h2 style={{ color: "#22543d" }}>🛠️ Garden Tools & Supplies</h2>
    <p>Here are some recommended tools and supplies for your garden:</p>
    <ul style={{ textAlign: "left" }}>
      {toolsList.map((tool, idx) => (
        <li key={idx} style={{ marginBottom: 12 }}>
          <strong>{tool.name}</strong>: {tool.description}
        </li>
      ))}
    </ul>
    <button
      style={{ marginTop: "2rem", padding: "0.7rem 2rem", fontSize: "1rem" }}
      onClick={onBack}
    >
      Back to Home
    </button>
  </div>
);

export default ToolsAndSupplies;