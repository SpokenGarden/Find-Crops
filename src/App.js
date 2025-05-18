import React, { useState, useEffect } from "react";

export default function GardenPlannerApp() {
  const [cropData, setCropData] = useState([]);
  const [zone, setZone] = useState("");
  const [category, setCategory] = useState("all");
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [frostDate, setFrostDate] = useState("");

  useEffect(() => {
    fetch("/cropData.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded crop data:", data); // Debug log
        setCropData(data);
      })
      .catch((err) => console.error("Failed to load crop data:", err));
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log("User Location:", latitude, longitude);
        // Placeholder: You could call a frost-date or zone API here using lat/lon
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

const parseSowWindow = (text, baseDate) => {
  if (!text || !baseDate) return "N/A";
  const match = text.match(/(\d+)\s*(to|-)?\s*(\d+)?\s*(before|after)/i);
  if (!match) return "N/A";

  const [, from, , to, direction] = match;
  const startWeeks = parseInt(from);
  const endWeeks = parseInt(to || from);
  const sign = direction.toLowerCase() === "before" ? -1 : 1;

  const firstDate = new Date(baseDate);
  const secondDate = new Date(baseDate);
  firstDate.setDate(firstDate.getDate() + sign * startWeeks * 7);
  secondDate.setDate(secondDate.getDate() + sign * endWeeks * 7);

  const sortedDates = [firstDate, secondDate].sort((a, b) => a - b);
  return `${sortedDates[0].toLocaleDateString()} – ${sortedDates[1].toLocaleDateString()}`;
};



  const handleSearch = () => {
    const results = (cropData || []).filter((crop) => {
      if (!crop || !crop.Grow_Zones || !crop.Type || !crop.Crop) return false;

      const userZone = zone.trim();
      const zoneList = crop.Grow_Zones.replace(/[^\d\-\s,]/g, '')
        .split(/[\s,]+/)
        .flatMap(z => {
          if (z.includes('-')) {
            const [start, end] = z.split('-').map(Number);
            return Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString());
          }
          return z ? [z] : [];
        });

      const zoneMatch = userZone === "" || zoneList.includes(userZone);
      const categoryMatch =
        category === "all" || crop.Type.toLowerCase() === category.toLowerCase();

      return zoneMatch && categoryMatch;
    });

    console.log("User Zone:", zone);
    console.log("Category:", category);
    console.log("Filtered Crops:", results);

    const sorted = results.sort((a, b) => {
      const aDays = parseInt(a.Days_to_Germination);
      const bDays = parseInt(b.Days_to_Germination);

      if (isNaN(aDays)) return 1;
      if (isNaN(bDays)) return -1;
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
          Average Last Frost Date:
          <input
            type="date"
            value={frostDate}
            onChange={(e) => setFrostDate(e.target.value)}
            style={{ marginLeft: "0.5rem", padding: "0.3rem 0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </label>
        <button onClick={handleGetLocation} style={{ marginLeft: "1rem", padding: "0.3rem 0.6rem" }}>📍 Use My Location</button>
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

      {filteredCrops.length > 0 ? (
        <div>We have {filteredCrops.length} crops to show!</div>
      ) : (
        <div>No crops found yet. Try searching.</div>
      )}

      {filteredCrops.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ color: "#40916c" }}>🌼 Recommended Crops</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {filteredCrops.map((crop, index) => (
              <li
                key={crop.Crop + index}
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
                🌱 Sow Indoors: {parseSowWindow(crop.Sow_Indoors, frostDate)}<br />
                🌿 Sow Outdoors: {parseSowWindow(crop.Sow_Outdoors, frostDate)}<br />
                ⏱ Days to Germination: {crop.Days_to_Germination || "N/A"}<br />
                🍅 Days to Harvest: {crop.Days_to_Harvest || "N/A"}<br />
                🌞 Sun: {crop.Sun_Requirements || "N/A"}<br />
                💧 Water: {crop.Water_Needs || "N/A"}<br />
                🪨 Soil: {crop.Soil_Preferences || "N/A"}<br />
                📍 Grow Zones: {formatZones(crop.Grow_Zones || "")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
