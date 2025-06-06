import React from "react";
import BackHomeButton from "./BackHomeButton";
import ToolCard from "./ToolCard";

// Example image and buyUrl data for illustration.
// Replace imageUrl and buyUrl values with your actual images and affiliate links!
const toolSections = [
  {
    title: "Seed Sowing Tools",
    items: [
      {
        name: "Little Dibby or Dibby XL Seed Dibbers",
        description: "For making precise planting depth holes in soil for seed sowing or transplanting seedlings.",
        usage: "Makes seed sowing fast, easy, and consistent. Great for all seed sizes.",
        imageUrl: "/images/tools/Green_DXL.jpg",
        buyUrl: "https://amzn.to/3ZEdM07"
      },
      {
        name: "Seed Sower",
        description: "Helps distribute seeds evenly in rows or trays.",
        usage: "Prevents overseeding and saves seeds.",
        imageUrl: "https://images.example.com/seed-sower.jpg",
        buyUrl: "https://www.amazon.com/your-seed-sower-affiliate-link"
      }
      // Add more seed sowing tools here!
    ]
  },
  {
    title: "Seed Sowing Supplies",
    items: [
      {
        name: "Potting Soil",
        description: "Nutrient-rich soil for starting seeds indoors or outdoors.",
        usage: "Promotes healthy root growth in seedlings.",
        imageUrl: "https://images.example.com/potting-soil.jpg",
        buyUrl: "https://www.amazon.com/your-potting-soil-affiliate-link"
      },
      {
        name: "Seed Trays",
        description: "Plastic or biodegradable trays for starting many seeds at once.",
        usage: "Organizes seedlings and makes transplanting easy.",
        imageUrl: "https://images.example.com/seed-trays.jpg",
        buyUrl: "https://www.amazon.com/your-seed-trays-affiliate-link"
      },
      {
        name: "Growing Medium",
        description: "Materials like peat, coir, or seed starting mix.",
        usage: "Provides a sterile environment for seed germination.",
        imageUrl: "https://images.example.com/growing-medium.jpg",
        buyUrl: "https://www.amazon.com/your-growing-medium-affiliate-link"
      },
      {
        name: "Heating Mats",
        description: "Provides bottom heat for faster seed germination.",
        usage: "Ideal for starting seeds in cool environments.",
        imageUrl: "https://images.example.com/heating-mat.jpg",
        buyUrl: "https://www.amazon.com/your-heating-mat-affiliate-link"
      },
      {
        name: "Thermostat",
        description: "Regulates mat temperature for optimal seed starting.",
        usage: "Prevents overheating of seedling trays.",
        imageUrl: "https://images.example.com/thermostat.jpg",
        buyUrl: "https://www.amazon.com/your-thermostat-affiliate-link"
      },
      {
        name: "Watering Can",
        description: "Gentle watering for delicate seedlings.",
        usage: "Prevents soil disturbance when watering.",
        imageUrl: "https://images.example.com/watering-can.jpg",
        buyUrl: "https://www.amazon.com/your-watering-can-affiliate-link"
      }
      // Add more sowing supplies here!
    ]
  },
  {
    title: "Pruning Tools",
    items: [
      {
        name: "Pruning Shears",
        description: "For trimming and shaping plants.",
        usage: "Makes clean cuts on stems and small branches.",
        imageUrl: "https://images.example.com/pruning-shears.jpg",
        buyUrl: "https://www.amazon.com/your-pruning-shears-affiliate-link"
      },
      {
        name: "Bypass Loppers",
        description: "For cutting thicker branches and stems.",
        usage: "Provides extra leverage for tough cuts.",
        imageUrl: "https://images.example.com/bypass-loppers.jpg",
        buyUrl: "https://www.amazon.com/your-bypass-loppers-affiliate-link"
      }
      // Add more pruning tools here!
    ]
  },
  {
    title: "Planting Tools",
    items: [
      {
        name: "Hand Trowel",
        description: "For digging small planting holes and transplanting.",
        usage: "Ideal for containers, beds, and raised gardens.",
        imageUrl: "https://images.example.com/hand-trowel.jpg",
        buyUrl: "https://www.amazon.com/your-hand-trowel-affiliate-link"
      },
      {
        name: "Transplanter",
        description: "Narrow tool for moving seedlings or small plants.",
        usage: "Prevents root disturbance during transplanting.",
        imageUrl: "https://images.example.com/transplanter.jpg",
        buyUrl: "https://www.amazon.com/your-transplanter-affiliate-link"
      }
      // Add more planting tools here!
    ]
  },
  {
    title: "Fertilizing Supplies",
    items: [
      {
        name: "Compost",
        description: "Organic matter for enriching garden soil.",
        usage: "Improves soil structure and fertility.",
        imageUrl: "https://images.example.com/compost.jpg",
        buyUrl: "https://www.amazon.com/your-compost-affiliate-link"
      },
      {
        name: "Fertilizer Spreader",
        description: "Applies fertilizer evenly to lawn or beds.",
        usage: "Ensures even distribution and prevents waste.",
        imageUrl: "https://images.example.com/fertilizer-spreader.jpg",
        buyUrl: "https://www.amazon.com/your-fertilizer-spreader-affiliate-link"
      }
      // Add more fertilizing supplies here!
    ]
  },
  {
    title: "Irrigation Tools & Supplies",
    items: [
      {
        name: "Soaker Hose",
        description: "Delivers water directly to plant roots.",
        usage: "Reduces water waste and targets root zones.",
        imageUrl: "https://images.example.com/soaker-hose.jpg",
        buyUrl: "https://www.amazon.com/your-soaker-hose-affiliate-link"
      },
      {
        name: "Drip Irrigation Kit",
        description: "Efficient watering system for garden beds.",
        usage: "Automates watering for less maintenance.",
        imageUrl: "https://images.example.com/drip-irrigation.jpg",
        buyUrl: "https://www.amazon.com/your-drip-irrigation-affiliate-link"
      }
      // Add more irrigation tools and supplies here!
    ]
  }
  // Add more sections as needed!
];

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "1.5rem",
  marginTop: "1.2rem"
};

const ToolsAndSupplies = ({ onBack }) => (
  <div
    style={{
      maxWidth: 1100,
      margin: "2rem auto",
      padding: "2rem",
      background: "#f9f9f6",
      borderRadius: 16,
      position: "relative",
      minHeight: 400
    }}
  >
    {/* Top Left */}
    <div style={{ position: "absolute", top: 20, left: 20 }}>
      <BackHomeButton onClick={onBack} />
    </div>
    <h2 style={{ color: "#22543d", marginTop: 0, textAlign: "center" }}>
      🛠️ Garden Tools & Supplies
    </h2>
    <p style={{ textAlign: "center" }}>
      Browse tools and supplies by category. Click on any card to learn more or buy!
    </p>
    <div>
      {toolSections.map((section, idx) => (
        <div key={idx} style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ color: "#40916c", marginBottom: "0.5rem" }}>{section.title}</h3>
          <div style={gridStyle}>
            {section.items.map((tool, tidx) => (
              <ToolCard
                key={tidx}
                name={tool.name}
                description={tool.description}
                usage={tool.usage}
                imageUrl={tool.imageUrl}
                buyUrl={tool.buyUrl}
              />
            ))}
          </div>
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
