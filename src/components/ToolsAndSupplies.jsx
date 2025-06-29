import React, { useEffect, useState } from "react";
import BackHomeButton from "./BackHomeButton";
import ToolCard from "./ToolCard";

const toolSections = [
  {
    title: "Seed Sowing Tools",
    items: [
      {
        name: "Little Dibby or Dibby XL Seed Dibbers",
        description: "A seed dibber and widger in 1 tool! Sow and Transplant in 1 tool!",
        usage: "Makes seed sowing fast, easy, and consistent. Great for all general seed sizes.",
        imageUrl: "/images/tools/GreenDXL.jpg",
        buyUrl: "https://amzn.to/3ZEdM07"
      },
      {
        name: "Seeding Square",
        description: "Get bigger harvests and optimize your growing space!",
        usage: "Helps space seeds for best spacing and plant health/growth. Prevents overseeding.",
        imageUrl: "images/tools/SeedingSquare.jpg",
        buyUrl: "https://amzn.to/3FIqyDQ"
      }
      // Add more seed sowing tools here!
    ]
  },
  {
    title: "Seed Sowing Supplies",
    items: [
      {
        name: "Espoma Organic Seed Starter Premium Mix",
        description: "Organic seed starting soil specially formulated to grow seedlings indoors or outdoors.",
        usage: "Promotes high germination, healthy root growth, and seedling development.",
        imageUrl: "images/tools/EspomaSeedStarter.jpg",
        buyUrl: "https://amzn.to/3Tadfz1"
      },
      {
        name: "Vego Seed Starting Trays - Mixed Sizes",
        description: "Durable and reusable seeding starting plastic trays with domes.",
        usage: "Versatile seed starting cells for shallow and deep rooted seedlings.",
        imageUrl: "images/tools/vegoseedstarttrays.jpg",
        buyUrl: "https://amzn.to/43OQ2HQ"
      },
      {
        name: "Heating Mats",
        description: "Provides bottom heat for faster seed germination and healthy seedling growth.",
        usage: "Ideal for starting seeds early and in cool environments.",
        imageUrl: "images/tools/Heating-Mats.jpg",
        buyUrl: "https://amzn.to/4dW1SEx"
      },
      {
        name: "Thermostat",
        description: "Consistently keep your soil temperature warm for best germination.",
        usage: "Regulates temperature and prevents overheating of seedling trays.",
        imageUrl: "images/tools/Seedling-Thermostat.jpg",
        buyUrl: "https://amzn.to/4kAULnH"
      },
      {
        name: "Seedling Spray Bottles",
        description: "Gentle watering for delicate seeds and seedlings.",
        usage: "Prevents soil disturbance when watering.",
        imageUrl: "images/tools/Spray-Bottles.jpg",
        buyUrl: "https://amzn.to/4l37Ky9"
      },
      // Add more sowing supplies here!
    ]
  },
  {
    title: "Pruning Tools",
    items: [
      {
        name: "Pruning Hand Shears",
        description: "For cuts up to 1-inch, trimming and shaping plants.",
        usage: "Makes clean cuts on stems and small branches.",
        imageUrl: "images/tools/handshears.jpg",
        buyUrl: "https://amzn.to/3FP1vza"
      },
      {
        name: "Bypass Loppers",
        description: "For cutting up to 2-3 inches, thicker branches and stems.",
        usage: "Provides extra leverage for tough cuts.",
        imageUrl: "images/tools/loppers.jpg",
        buyUrl: "https://amzn.to/4l8IDdr"
      }
      // Add more pruning tools here!
    ]
  },
  {
    title: "Planting Tools",
    items: [
      {
        name: "Hand Trowel",
        description: "For digging small planting holes, transplanting, weeding, and more.",
        usage: "Ideal for containers, beds, and raised gardens.",
        imageUrl: "images/tools/handtrowel.jpg",
        buyUrl: "https://amzn.to/4jKRdOg"
      },
      {
        name: "Transplanter",
        description: "Narrow tool for moving seedlings or small plants.",
        usage: "Prevents root disturbance during transplanting.",
        imageUrl: "images/tools/transplanter.jpg",
        buyUrl: "https://amzn.to/3HxvJqX"
      }
      // Add more planting tools here!
    ]
  },
  {
    title: "Fertilizing Supplies",
    items: [
      {
        name: "General Fertilizer",
        description: "Organically-based nutrients for your plants.",
        usage: "Supplies essential nutrients for healthy plant growth and fruit development.",
        imageUrl: "images/tools/general_fertilizer.jpg",
        buyUrl: "https://amzn.to/3TjyMW7"
      },
            {
        name: "Tomato and Vegetable Fertilizer",
        description: "Organically-based nutrients for your vegetables.",
        usage: "Supplies essential nutrients for bigger, more nutritious vegetables and fruit.",
        imageUrl: "images/tools/crop_fertilizer.jpg",
        buyUrl: "https://amzn.to/45lrRTK"
      },
      {
        name: "Compost",
        description: "Organic matter for enriching garden soil.",
        usage: "Improves soil structure and fertility for healthier plants.",
        imageUrl: "images/tools/compost_bag.jpg",
        buyUrl: "https://amzn.to/43TUUez"
      }
      // Add more fertilizing supplies here!
    ]
  },
    {
    title: "Pest and Disease Control",
    items: [
      {
        name: "Slug and Snail Control",
        description: "Keep flowers and your garden free of slugs and snails.",
        usage: "Shake around plants to lower damage and encourage healthy growth.",
        imageUrl: "images/tools/slugcontrol.jpg",
        buyUrl: "https://amzn.to/4kESdVF"
      },
      {
        name: "Neem Oil",
        description: "Helps control insects and more in your garden.",
        usage: "Safe to hand mix in spray bottles and apply to many different plants.",
        imageUrl: "images/tools/neemoil.jpg",
        buyUrl: "https://amzn.to/4jKotVW"
      }
      // Add more irrigation tools and supplies here!
    ]
  },
  {
    title: "Irrigation Tools & Supplies",
    items: [
      {
        name: "Soaker Hose",
        description: "Delivers water at soil level making directly available to plant roots.",
        usage: "Reduces water waste and targets plant root zones.",
        imageUrl: "images/tools/soakerhose.jpg",
        buyUrl: "https://amzn.to/3FZhaM9"
      },
      {
        name: "Drip Irrigation Kit",
        description: "Efficient watering system for garden beds.",
        usage: "Automates watering for less maintenance.",
        imageUrl: "images/tools/dripkit.jpg",
        buyUrl: "https://amzn.to/3HSrLZP"
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

const ToolsAndSupplies = ({ onBack }) => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    // Replace with your actual API endpoint if different
    fetch("https://deals-hlcl.onrender.com/api/deals")
      .then(res => res.json())
      .then(data => setDeals(data.deals))
      .catch(() => setDeals([]));
  }, []);

  return (
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
      {/* Responsive Back Button CSS */}
      <style>{`
        .gp-back-btn {
          position: absolute;
          top: 22px;
          left: 22px;
          z-index: 20;
          background: #b7e6cf;
          border: none;
          border-radius: 13px;
          padding: 0.7em 1.3em;
          font-size: 1.13rem;
          color: #155943;
          font-weight: 700;
          box-shadow: 0 2px 10px rgba(34,74,66,0.08);
          cursor: pointer;
          transition: background 0.18s;
        }
        @media (max-width: 700px) {
          .gp-back-btn {
            position: static;
            display: block;
            margin-bottom: 0.85em;
            margin-left: 0;
            margin-top: 0.5em;
            width: auto;
          }
        }
        @media (max-width: 480px) {
          .gp-back-btn {
            font-size: 1rem;
            padding: 0.6em 1em;
          }
        }
      `}</style>
      {/* Top Left Back Button */}
      <button className="gp-back-btn" onClick={onBack}>
        ← Back to Home
      </button>
      <h2 style={{ color: "#22543d", marginTop: 0, textAlign: "center" }}>
        🛠️ Garden Tools & Supplies
      </h2>
      <p style={{ textAlign: "center" }}>
        Browse tools and supplies by category. 
        </p>
       <p style={{ textAlign: "center"}}>
        All product links on this page are affiliate links. 
        </p>
      <p style={{ textAlign: "center"}}>
        If you make a purchase, we might get a small commission.
        </p>
      <p style={{ textAlign: "center"}}>
        Thank you!
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
        <button className="gp-back-btn" onClick={onBack}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default ToolsAndSupplies;
