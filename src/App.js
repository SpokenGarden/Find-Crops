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
        console.log("Loaded crop data:", data);
        setCropData(data);
      })
      .catch((err) => console.error("Failed to load crop data:", err));
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("User's location:", position.coords);
          alert("Your location has been received. Use an external API to match to a zone or frost date.");
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSearch = () => {
    console.log("Find Crops button clicked");
    const matches = cropData.filter((crop) => {
      const zoneMatch = crop.Grow_Zones && crop.Grow_Zones.includes(zone);
      const categoryMatch = category === "all" || crop.Type === category;
      const sunMatch = sunRequirement === "all" || crop.Sun_Requirement === sunRequirement;
      const waterMatch = waterNeed === "all" || crop.Water_Need === waterNeed;
      const soilMatch = soilPreference === "all" || crop.Soil_Preference === soilPreference;
      return zoneMatch && categoryMatch && sunMatch && waterMatch && soilMatch;
    });
    setFilteredCrops(matches);
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
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "500px" }}>
              <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#2d6a4f", textAlign: "center" }}>🌱 GrowBuddy Garden Planner</h1>

              <label>Grow Zone:
                <input type="text" value={zone} onChange={(e) => setZone(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
              </label>

              <label>Last Frost Date:
                <input type="date" value={frostDate} onChange={(e) => setFrostDate(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
              </label>

              <button onClick={handleGetLocation} style={{ padding: "0.6rem", borderRadius: "4px", backgroundColor: "#d3f9d8" }}>📍 Use My Location</button>

              <label>Category:
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
                  <option value="all">All</option>
                  <option value="flower">Flowers</option>
                  <option value="herb">Herbs</option>
                  <option value="vegetable">Vegetables</option>
                </select>
              </label>

              <label>Sun Requirement:
                <select value={sunRequirement} onChange={(e) => setSunRequirement(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
                  <option value="all">All</option>
                  <option value="full sun">Full Sun</option>
                  <option value="part shade">Part Shade</option>
                  <option value="full shade">Full Shade</option>
                </select>
              </label>

              <label>Water Need:
                <select value={waterNeed} onChange={(e) => setWaterNeed(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
                  <option value="all">All</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </label>

              <label>Soil Preference:
                <select value={soilPreference} onChange={(e) => setSoilPreference(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
                  <option value="all">All</option>
                  <option value="loamy">Loamy</option>
                  <option value="sandy">Sandy</option>
                  <option value="clay">Clay</option>
                  <option value="well-drained">Well-drained</option>
                </select>
              </label>

              <button
                onClick={handleSearch}
                style={{ backgroundColor: "#40916c", color: "white", padding: "0.75rem", border: "none", borderRadius: "6px", fontSize: "1rem", cursor: "pointer" }}
              >
                Find Crops
              </button>
            </div>
          </div>

          <h2 style={{ color: '#2d6a4f', marginTop: '2rem' }}>📆 Sowing Calendar</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredCrops.map((crop, index) => (
              <li key={`calendar-${index}`} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#fefae0', borderRadius: '8px' }}>
                <strong>{crop.Crop}</strong><br />
                🌱 <strong>Sow Indoors:</strong> Week of {crop.Sow_Indoors_Start || 'N/A'} – {crop.Sow_Indoors_End || 'N/A'}<br />
                🌿 <strong>Sow Outdoors:</strong> Week of {crop.Sow_Outdoors_Start || 'N/A'} – {crop.Sow_Outdoors_End || 'N/A'}
              </li>
            ))}
          </ul>
              <h2 style={{ color: "#2d6a4f" }}>🌾 {filteredCrops.length} Crop(s) Found:</h2>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {filteredCrops.map((crop, index) => (
                  <li key={index} style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#e6f4ea", borderRadius: "8px" }}>
                    <strong>{crop.Crop}</strong> – {crop.Type}<br />
                    Sun: {crop.Sun_Requirement} | Water: {crop.Water_Need} | Soil: {crop.Soil_Preference}
                  </li>
                ))}
            </ul>
</div>
</>
)}
</div>
  );
}

