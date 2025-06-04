import React from "react";
import BackHomeButton from "./BackHomeButton";

// Example data structure for easy expansion:
const toolSections = [
  {
    title: "Seed Sowing Tools",
    items: [
      { name: "Little Dibby or Dibby XL Seed Dibbers", description: "For making precise planting depth holes in soil for seed sowing or transplanting seedlings.", url: "https://amzn.to/3ZEdM07" },
      { name: "Seed Sower", description: "Helps distribute seeds evenly in rows or trays." },
      // Add more seed sowing tools here!
    ]
  },
  {
    title: "Seed Sowing Supplies",
    items: [
      { name: "Potting Soil", description: "Nutrient-rich soil for starting seeds indoors or outdoors." },
      { name: "Seed Trays", description: "Plastic or biodegradable trays for starting many seeds at once." },
      { name: "Growing Medium", description: "Materials like peat, coir, or seed starting mix." },
      { name: "Heating Mats", description: "Provides bottom heat for faster seed germination." },
      { name: "Thermostat", description: "Regulates mat temperature for optimal seed starting." },
      { name: "Watering Can", description: "Gentle watering for delicate seedlings." },
      // Add more sowing supplies here!
    ]
  },
  {
    title: "Pruning Tools",
    items: [
      { name: "Pruning Shears", description: "For trimming and shaping plants." },
      { name: "Bypass Loppers", description: "For cutting thicker branches and stems." },
      // Add more pruning tools here!
    ]
  },
  {
    title: "Planting Tools",
    items: [
      { name: "Hand Trowel", description: "For digging small planting holes and transplanting." },
      { name: "Transplanter", description: "Narrow tool for moving seedlings or small plants." },
      // Add more planting tools here!
    ]
  },
  {
    title: "Fertilizing Supplies",
    items: [
      { name: "Compost", description: "Organic matter for enriching garden soil." },
      { name: "Fertilizer Spreader", description: "Applies fertilizer evenly to lawn or beds." },
      // Add more fertilizing supplies here!
    ]
  },
  {
    title: "Irrigation Tools & Supplies",
    items: [
      { name: "Soaker Hose", description: "Delivers water directly to plant roots." },
      { name: "Drip Irrigation Kit", description: "Efficient watering system for garden beds." },
      // Add more irrigation tools and supplies here!
    ]
  },
  // Add more sections as needed!
];

const ToolsAndSupplies = ({ onBack }) => (
  <div
    style={{
      maxWidth: 800,
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
    <p style={{ textAlign: "center" }}>
      Browse tools and supplies by category. Click a section below to explore!
    </p>
    <div>
      {toolSections.map((section, idx) => (
        <div key={idx} style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ color: "#40916c", marginBottom: "0.5rem" }}>{section.title}</h3>
          <ul style={{ textAlign: "left", paddingLeft: 24 }}>
            {section.items.map((tool, tidx) => (
              <li key={tidx} style={{ marginBottom: 8 }}>
                <strong>{tool.name}</strong>: {tool.description}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    {/* Bottom */}
    <div style={{ marginTop: "3rem", textAlign: "center" }}>
      <BackHomeButton onClick={onBack} />
    </div>
  </div>
);

export default ToolsAndSupplies;
