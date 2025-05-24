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

  //... all existing logic functions stay the same ...

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
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "500px" }}>
            <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#2d6a4f", textAlign: "center" }}>🌱 GrowBuddy Garden Planner</h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label>
                Enter Your Grow Zone:
                <input
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
                  placeholder="e.g., 7"
                />
              </label>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label>
                Average Last Frost Date:
                <input
                  type="date"
                  value={frostDate}
                  onChange={(e) => setFrostDate(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
                />
              </label>
              <button onClick={handleGetLocation} style={{ marginTop: "0.5rem", padding: "0.6rem", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }}>📍 Use My Location</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label>
                Select Category:
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
                >
                  <option value="all">All</option>
                  <option value="flower">Flowers</option>
                  <option value="herb">Herbs</option>
                  <option value="vegetable">Vegetables</option>
                </select>
              </label>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label>
                Sun Requirement:
                <select
                  value={sunRequirement}
                  onChange={(e) => setSunRequirement(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
                >
                  <option value="all">All</option>
                  <option value="full sun">Full Sun</option>
                  <option value="part shade">Part Shade</option>
                  <option value="full shade">Full Shade</option>
                </select>
              </label>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label>
                Water Need:
                <select
                  value={waterNeed}
                  onChange={(e) => setWaterNeed(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
                >
                  <option value="all">All</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </label>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label>
                Soil Preference:
                <select
                  value={soilPreference}
                  onChange={(e) => setSoilPreference(e.target.value)}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
                >
                  <option value="all">All</option>
                  <option value="loamy">Loamy</option>
                  <option value="sandy">Sandy</option>
                  <option value="clay">Clay</option>
                  <option value="well-drained">Well-drained</option>
                </select>
              </label>
            </div>

            <button
              onClick={handleSearch}
              style={{ padding: "0.75rem 1rem", backgroundColor: "#52b788", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", width: "100%" }}
            >
              Find Crops
            </button>

            {filteredCrops.length > 0 && (
              <button
                onClick={generateSowingCalendar}
                style={{ padding: "0.75rem 1rem", backgroundColor: "#40916c", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", width: "100%" }}
              >
                📅 View Sowing Calendar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
