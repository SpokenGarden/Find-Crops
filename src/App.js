import React, { useState, useEffect } from "react";
import { filterCrops } from "./utils/filterCrops";
import { buildSowingCalendar } from "./utils/sowingCalendar";

// Simple helpers for persistent state
const getLocal = (key, fallback) => {
  try {
    const val = window.localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};
const setLocal = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export default function GardenPlannerApp() {
  const [started, setStarted] = useState(getLocal("started", false));
  const [cropData, setCropData] = useState([]);
  const [zone, setZone] = useState(getLocal("zone", ""));
  const [category, setCategory] = useState(getLocal("category", "all"));
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [frostDate, setFrostDate] = useState(getLocal("frostDate", ""));
  const [sunRequirement, setSunRequirement] = useState(getLocal("sunRequirement", "all"));
  const [waterNeed, setWaterNeed] = useState(getLocal("waterNeed", "all"));
  const [soilPreference, setSoilPreference] = useState(getLocal("soilPreference", "all"));
  const [loading, setLoading] = useState(false);
  const [sowingCalendar, setSowingCalendar] = useState([]);

  // Persist settings
  useEffect(() => { setLocal("started", started); }, [started]);
  useEffect(() => { setLocal("zone", zone); }, [zone]);
  useEffect(() => { setLocal("category", category); }, [category]);
  useEffect(() => { setLocal("frostDate", frostDate); }, [frostDate]);
  useEffect(() => { setLocal("sunRequirement", sunRequirement); }, [sunRequirement]);
  useEffect(() => { setLocal("waterNeed", waterNeed); }, [waterNeed]);
  useEffect(() => { setLocal("soilPreference", soilPreference); }, [soilPreference]);

  useEffect(() => {
    setLoading(true);
    fetch("/cropData.json")
      .then((res) => res.json())
      .then((data) => {
        setCropData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load crop data:", err);
        setLoading(false);
      });
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // TODO: Integrate with geocoding API to convert lat/lng to grow zone/frost date
          console.log("User's location:", position.coords);
          alert("Your location has been received. (TODO: Use an external API to match to a zone or frost date.)");
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
    setLoading(true);
    setTimeout(() => {
      const matches = filterCrops(cropData, { zone, category, sunRequirement, waterNeed, soilPreference });
      setFilteredCrops(matches);
      setSowingCalendar(buildSowingCalendar(matches, frostDate));
      setLoading(false);
    }, 150);
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

          <div>
            {loading && (
              <div style={{ textAlign: "center", color: "#40916c", marginTop: "2rem" }}>
                Loading...
              </div>
            )}

            {!loading && (
              <>
                <h2 style={{ color: '#2d6a4f', marginTop: '2rem' }}>📆 Complete Sowing Calendar</h2>
<button
  onClick={() => {
    localStorage.setItem("sowingCalendar", JSON.stringify(filteredCrops));
    window.open("/calendar.html", "_blank");
  }}
  style={{
    marginTop: "1rem",
    backgroundColor: "#457b9d",
    color: "white",
    padding: "0.75rem",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer"
  }}
>
  📅 Open Sowing Calendar
</button>

                {sowingCalendar.length === 0 && (
                  <div style={{ color: "#b7b7b7", textAlign: "center" }}>
                    No calendar to show. Please enter a last frost date and search for crops.
                  </div>
                )}
                {sowingCalendar.length > 0 && (
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                    <thead>
                      <tr style={{ background: "#e6f4ea" }}>
                        <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Week of</th>
                        <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Sow Indoors</th>
                        <th style={{ padding: "0.5rem", border: "1px solid #ccc" }}>Sow Outdoors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sowingCalendar.map((week, i) => (
                        <tr key={i}>
                          <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                            {week.weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                            {week.week === 0 ? " (Frost)" : ""}
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                            {week.indoors.length ? week.indoors.join(", ") : "-"}
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                            {week.outdoors.length ? week.outdoors.join(", ") : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <h2 style={{ color: "#2d6a4f", marginTop: "2rem" }}>🌾 {filteredCrops.length} Crop(s) Found:</h2>
                  <ul style={{ listStyle: "none", padding: 0 }}>
  {filteredCrops.length === 0 && <li>No crops found for your criteria.</li>}
  {filteredCrops.map((crop, index) => (
    <li
      key={index}
      style={{
        margin: "1rem auto",
        padding: "1rem",
        backgroundColor: "#e6f4ea",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        maxWidth: "600px",
        width: "90%",
        textAlign: "left"
      }}
    >
      <strong style={{ fontSize: "1.1rem" }}>{crop.Crop}</strong> – {crop.Type}
      <ul style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}>
        <li>☀️ <strong>Sun:</strong> {crop.Sun_Requirement}</li>
        <li>💧 <strong>Water:</strong> {crop.Water_Need}</li>
        <li>🌱 <strong>Soil:</strong> {crop.Soil_Preference}</li>
        <li>📦 <strong>Zones:</strong> {crop.Grow_Zones || "N/A"}</li>
       <li>
  🪴 <strong>Sow Indoors:</strong>
  {crop.Sow_Indoors_Start && crop.Sow_Indoors_End
    ? ` Week of ${new Date(crop.Sow_Indoors_Start).toLocaleDateString()} – ${new Date(crop.Sow_Indoors_End).toLocaleDateString()}`
    : " N/A"}
</li>
<li>
  🌿 <strong>Sow Outdoors:</strong>
  {crop.Sow_Outdoors_Start && crop.Sow_Outdoors_End
    ? ` Week of ${new Date(crop.Sow_Outdoors_Start).toLocaleDateString()} – ${new Date(crop.Sow_Outdoors_End).toLocaleDateString()}`
    : " N/A"}
</li>

        <li>⏳ <strong>Days to Harvest:</strong> {crop.Days_to_Harvest || "N/A"}</li>
      </ul>
      {crop.Link && (
        <a
          href={crop.Link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#2d6a4f",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          🔗 Buy Now
        </a>
      )}
    </li>
  ))}
</ul>


              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
