import React, { useState, useEffect } from "react";

export default function GardenPlannerApp() {
  const [cropData, setCropData] = useState([]);
  const [zone, setZone] = useState("");
  const [category, setCategory] = useState("all");
  const [filteredCrops, setFilteredCrops] = useState([]);

  useEffect(() => {
    fetch("/cropData.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded crop data:", data); // Debug log
        setCropData(data);
      })
      .catch((err) => console.error("Failed to load crop data:", err));
  }, []);

  const handleSearch = () => {
    const zonePattern = new RegExp(`Zone\\s*${zone}`, "i");

    const results = (cropData || []).filter((crop) => {
      if (!crop || !crop.Grow_Zones || !crop.Type) return false;
      const zoneMatch =
        zone === "" || zonePattern.test(crop.Grow_Zones);
      const categoryMatch =
        category === "all" || crop.Type.toLowerCase() === category.toLowerCase();
      return zoneMatch && categoryMatch;
    });

    const sorted = results.sort((a, b) => {
      const aDays = parseInt(a.Days_to_Germination);
      const bDays = parseInt(b.Days_to_Germination);
      return aDays - bDays;
    });

    setFilteredCrops(sorted);
  };

  const formatZones = (zones) => {
    const numbers = zones.match(/\d+/g);
    return numbers ? numbers.join(", ") : zones;
  };

  const enhanceText = (text) => {
    return text.replace(/before/gi, "before your average last frost date");
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", padding: "2rem", maxWidth: "800px", margin: "0 auto", backgroundColor: "#fdfdfc" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#2d6a4f" }}>🌱 Little Dibby Garden Planner</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Enter Your Grow Zone:
          <input
            type="text"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            style={{ marginLeft: "0.5rem", padding: "0.3rem 0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
            placeholder="e.g., 7"
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Select Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ marginLeft: "0.5rem", padding: "0.3rem 0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            <option value="all">All</option>
            <option value="flower">Flowers</option>
            <option value="herb">Herbs</option>
            <option value="vegetable">Vegetables</option>
          </select>
        </label>
      </div>

      <button
        onClick={handleSearch}
        style={{ padding: "0.5rem 1rem", backgroundColor: "#52b788", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
      >
        Find Crops
      </button>

      {filteredCrops.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ color: "#40916c" }}>🌼 Recommended Crops</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {filteredCrops.map((crop, index) => (
              <li
                key={index}
                style={{
                  background: "#ffffff",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                }}
              >
                <strong style={{ fontSize: "1.1rem" }}>{crop.Crop}</strong> <em>({crop.Type})</em><br />
                🌱 Sow Indoors: {enhanceText(crop.Sow_Indoors)}<br />
                🌿 Sow Outdoors: {enhanceText(crop.Sow_Outdoors)}<br />
                ⏱ Days to Germination: {crop.Days_to_Germination}<br />
                🍅 Days to Harvest: {crop.Days_to_Harvest}<br />
                📍 Grow Zones: {formatZones(crop.Grow_Zones)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
