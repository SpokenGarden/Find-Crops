/* Full GrowBuddy App with restored interactive planner */
import React, { useState, useEffect } from "react";

export default function GardenPlannerApp() {
  const [started, setStarted] = useState(false);
  const [cropData, setCropData] = useState([]);
  const [zone, setZone] = useState("");
  const [category, setCategory] = useState("all");
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [frostDate, setFrostDate] = useState("");
  const [sunRequirement, setSunRequirement] = useState("all");
  const [waterNeed, setWaterNeed] = useState("all");
  const [soilPreference, setSoilPreference] = useState("all");

  useEffect(() => {
    fetch("/cropData.json")
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map(item => ({
          ...item,
          Crop: item["Crop Common Names"]
        }));
        setCropData(normalized);
      })
      .catch((err) => console.error("Failed to load crop data:", err));
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_min&timezone=auto`);
          const data = await response.json();
          console.log("Weather data:", data);
        } catch (error) {
          console.error("Error fetching frost date:", error);
        }
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const parseSowWindow = (text, baseDate) => {
    if (!text || !baseDate) return "N/A";
    const match = text.match(/(\d+)\s*(?:to|-)?\s*(\d+)?\s*(before|after)/i);
    if (!match) return "N/A";
    const from = match[1];
    const to = match[2];
    const direction = match[3];
    const startWeeks = parseInt(from);
    const endWeeks = parseInt(to || from);
    const sign = direction.toLowerCase() === "before" ? -1 : 1;
    const firstDate = new Date(baseDate);
    const secondDate = new Date(baseDate);
    firstDate.setDate(firstDate.getDate() + sign * startWeeks * 7);
    secondDate.setDate(secondDate.getDate() + sign * endWeeks * 7);
    const sortedDates = [firstDate, secondDate].sort((a, b) => a - b);
    return `${sortedDates[0].toLocaleDateString()} - ${sortedDates[1].toLocaleDateString()}`;
  };

  const handleSearch = () => {
    const userZone = zone.trim();
    const results = (cropData || []).filter((crop) => {
      if (!crop || !crop.Grow_Zones || !crop.Type || !crop.Crop) return false;
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
      const categoryMatch = category === "all" || crop.Type.toLowerCase() === category.toLowerCase();
      return zoneMatch && categoryMatch;
    });
    const sorted = results.sort((a, b) => {
      const aDays = parseInt(a.Days_to_Germination);
      const bDays = parseInt(b.Days_to_Germination);
      if (isNaN(aDays)) return 1;
      if (isNaN(bDays)) return -1;
      return aDays - bDays;
    });
    setFilteredCrops(sorted);
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", padding: "1rem", margin: "0 auto", backgroundColor: "#fdfdfc", maxWidth: "100%" }}>
      {!started ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "2rem", color: "#2d6a4f" }}>🌱 Welcome to GrowBuddy</h1>
          <p style={{ fontSize: "1.1rem", margin: "1rem 0" }}>Plan what to grow and when to sow with your frost date and grow zone.</p>
          <button
            onClick={() => setStarted(true)}
            style={{ padding: "1rem 2rem", fontSize: "1rem", backgroundColor: "#52b788", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
          >
            🌿 Start Planning
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <h2>🌼 Your Garden Planner</h2>
          <input type="text" placeholder="Enter your grow zone (e.g., 7)" value={zone} onChange={(e) => setZone(e.target.value)} />
          <input type="date" value={frostDate} onChange={(e) => setFrostDate(e.target.value)} />
          <button onClick={handleGetLocation}>📍 Use My Location</button>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All</option>
            <option value="flower">Flowers</option>
            <option value="herb">Herbs</option>
            <option value="vegetable">Vegetables</option>
          </select>
          <button onClick={handleSearch}>Find Crops</button>

          {filteredCrops.length > 0 && (
            <div>
              <h3>Found {filteredCrops.length} Crops:</h3>
              <ul>
                {filteredCrops.map((crop, i) => (
                  <li key={i}>
                    <strong>{crop.Crop}</strong> ({crop.Type})<br />
                    🌱 Sow Indoors: {parseSowWindow(crop["Sow Indoors"], frostDate)}<br />
                    🌿 Sow Outdoors: {parseSowWindow(crop["Sow Outdoors"], frostDate)}<br />
                    ⏱ Germination: {crop.Days_to_Germination || "N/A"}, 🍅 Harvest: {crop["Days to Harvest"] || "N/A"}<br />
                    📍 Zones: {crop.Grow_Zones || "N/A"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
