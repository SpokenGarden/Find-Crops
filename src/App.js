// App.js
import React, { useState, useEffect } from "react";
import { filterCrops } from "./utils/filterCrops";
import { buildSowingCalendar } from "./utils/sowingCalendar";
import CropCard from "./components/CropCard";
import ToolsAndSupplies from "./components/ToolsAndSupplies";

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
  // Use a single state to control which screen is visible
  // Possible values: "home", "search", "tools"
  const [screen, setScreen] = useState("home");

  // Crop search state
  const [cropData, setCropData] = useState({});
  const [zone, setZone] = useState(getLocal("zone", ""));
  const [category, setCategory] = useState(getLocal("category", "all"));
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [frostDate, setFrostDate] = useState(getLocal("frostDate", ""));
  const [sunRequirement, setSunRequirement] = useState(getLocal("sunRequirement", "all"));
  const [waterNeed, setWaterNeed] = useState(getLocal("waterNeed", "all"));
  const [soilPreference, setSoilPreference] = useState(getLocal("soilPreference", "all"));
  const [loading, setLoading] = useState(false);
  const [sowingCalendar, setSowingCalendar] = useState([]);

  // Persist user preferences
  useEffect(() => { setLocal("zone", zone); }, [zone]);
  useEffect(() => { setLocal("category", category); }, [category]);
  useEffect(() => { setLocal("frostDate", frostDate); }, [frostDate]);
  useEffect(() => { setLocal("sunRequirement", sunRequirement); }, [sunRequirement]);
  useEffect(() => { setLocal("waterNeed", waterNeed); }, [waterNeed]);
  useEffect(() => { setLocal("soilPreference", soilPreference); }, [soilPreference]);

  // Load crop data
  useEffect(() => {
    setLoading(true);
    fetch("/cropData.json")
      .then(res => res.json())
      .then(data => {
        setCropData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load crop data:", err);
        setLoading(false);
      });
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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
      // Convert cropData object to array of [name, data] pairs for filtering
      const cropArray = Object.entries(cropData).map(([name, data]) => ({
        name,
        ...data,
        _raw: data // keep original data as _raw for rendering in CropCard
      }));
      const matches = filterCrops(cropArray, { zone, category, sunRequirement, waterNeed, soilPreference });
      // Store as [name, cropData] pairs for CropCard rendering
      const filtered = matches.map(crop => [crop.name, crop._raw]);
      setFilteredCrops(filtered);
      setSowingCalendar(buildSowingCalendar(matches, frostDate));
      localStorage.setItem("sowingCalendar", JSON.stringify(matches));
      localStorage.setItem("frostDate", JSON.stringify(frostDate));
      setLoading(false);
    }, 150);
  };

  // --- Home Screen ---
  if (screen === "home") {
    return (
      <div style={{ fontFamily: "Poppins, sans-serif", padding: "1rem", margin: "0 auto", backgroundColor: "#fdfdfc", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "2rem", color: "#2d6a4f" }}>🌱 Welcome to The What-Grows Garden Planner</h1>
          <p style={{ fontSize: "1.1rem", margin: "1rem 0" }}>
            Plan what to grow, when to sow with your frost date, grow zone, specific planting depths and spacings, and a whole lot more.
          </p>
          <button
            onClick={() => setScreen("search")}
            style={{ padding: "1rem 2rem", fontSize: "1rem", backgroundColor: "#52b788", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", margin: "0.5rem" }}
          >
            🌿 Start Planning
          </button>
          <button
            onClick={() => setScreen("tools")}
            style={{ padding: "1rem 2rem", fontSize: "1rem", backgroundColor: "#40916c", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", margin: "0.5rem" }}
          >
            🛠️ Get Tools and Supplies
          </button>
        </div>
      </div>
    );
  }

  // --- Tools and Supplies Screen ---
  if (screen === "tools") {
    return <ToolsAndSupplies onBack={() => setScreen("home")} />;
  }

  // --- Crop Search/Planner Screen ---
  // (Everything below is your original crop search/planner area, unchanged except for a "Back to Home" button)
  return (
    <div style={{ fontFamily: "Poppins, sans-serif", padding: "1rem", margin: "0 auto", backgroundColor: "#fdfdfc", maxWidth: "100%" }}>
      <button
        onClick={() => setScreen("home")}
        style={{ margin: "0 0 1.5rem 0", padding: "0.6rem 1.5rem", fontSize: "1rem", backgroundColor: "#b7e4c7", color: "#155943", border: "none", borderRadius: "8px", cursor: "pointer" }}
      >
        ← Back to Home
      </button>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "500px" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#2d6a4f", textAlign: "center" }}>🌱 The What-Grows Garden Planner</h1>
          <label>Grow Zone:<input type="text" value={zone} onChange={e => setZone(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} /></label>
          <label>Last Frost Date:<input type="date" value={frostDate} onChange={e => setFrostDate(e.target.value)} style={{ width: "100%", padding: "0.5rem" }} /></label>
          <button onClick={handleGetLocation} style={{ padding: "0.6rem", borderRadius: "4px", backgroundColor: "#d3f9d8" }}>📍 Use My Location</button>
          <label>Category:<select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
            <option value="all">All</option>
            <option value="flower">Flowers</option>
            <option value="herb">Herbs</option>
            <option value="vegetable">Vegetables</option>
          </select></label>
          <label>Sun Requirement:<select value={sunRequirement} onChange={e => setSunRequirement(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
            <option value="all">All</option>
            <option value="full sun">Full Sun</option>
            <option value="part shade">Part Shade</option>
            <option value="full shade">Full Shade</option>
          </select></label>
          <label>Water Need:<select value={waterNeed} onChange={e => setWaterNeed(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select></label>
          <label>Soil Preference:<select value={soilPreference} onChange={e => setSoilPreference(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
            <option value="all">All</option>
            <option value="loamy">Loamy</option>
            <option value="sandy">Sandy</option>
            <option value="clay">Clay</option>
            <option value="well-drained">Well-drained</option>
          </select></label>
          <button
            onClick={handleSearch}
            style={{ backgroundColor: "#40916c", color: "white", padding: "0.75rem", border: "none", borderRadius: "6px", fontSize: "1rem", cursor: "pointer" }}
          >
            Find Crops
          </button>
        </div>
      </div>

      {!loading && (
        <>
          <h2 style={{ color: "#2d6a4f", marginTop: "2rem" }}>
            🌾 {filteredCrops.length} Crop{filteredCrops.length !== 1 ? "s" : ""} Found:
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredCrops.length === 0 && <li>No crops found for your criteria.</li>}
            {filteredCrops.map(([cropName, cropDataItem]) => (
              <li key={cropName} style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#e6f4ea", borderRadius: "14px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", maxWidth: "600px" }}>
                <CropCard cropName={cropName} cropData={cropDataItem} />
              </li>
            ))}
          </ul>

          <h2 style={{ color: "#2d6a4f", marginTop: "2.5rem" }}>📆 Plan Your Sowing</h2>
          <button
            onClick={() => {
              const encodedData = encodeURIComponent(JSON.stringify(filteredCrops));
              const encodedDate = encodeURIComponent(frostDate);
              window.open(`/calendar.html?calendar=${encodedData}&frostDate=${encodedDate}`, "_blank");
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
            <div style={{ color: "#b7b7b7", textAlign: "center", marginTop: "1rem" }}>
              No calendar to show. Please enter a frost date and search for crops.
            </div>
          )}
        </>
      )}
    </div>
  );
}
