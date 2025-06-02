// Add this for debugging at the top of your file
console.log("cropFlatRows", cropFlatRows);

function transformCropData(flatRows) {
  if (!Array.isArray(flatRows)) {
    console.error("Expected an array for cropFlatRows but got:", flatRows);
    return {};
  }
  const crops = {};
  flatRows.forEach((row) => {
    const cropName = row["Crop Name"];
    const section = row["Object"];
    const label = row["Label"];
    const value = row["Value"];
    if (!cropName || !section || !label) return;
    if (!crops[cropName]) crops[cropName] = {};
    if (!crops[cropName][section]) crops[cropName][section] = [];
    crops[cropName][section].push({ label, value });
  });
  return crops;
}

const getLocal = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = window.localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

// App.js
import React, { useState, useEffect, useMemo } from "react";
import { filterCrops } from "./utils/filterCrops";
import { buildSowingCalendar } from "./utils/sowingCalendar";
import CropCard from "./components/CropCard";
import ToolsAndSupplies from "./components/ToolsAndSupplies";
import PlantingVideos from "./components/PlantingVideos";
import BackHomeButton from "./components/BackHomeButton";

// === NEW: Import your flat crop data JSON ===
import cropFlatRows from "./data/cropdata.json";


  return crops;
}

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
  // UI state
  const [screen, setScreen] = useState("home");

  // === NEW: Use transformed crop data ===
  const crops = useMemo(() => transformCropData(cropFlatRows), []);

  // Crop search state
  const [zone, setZone] = useState(getLocal("zone", ""));
  const [category, setCategory] = useState(getLocal("category", "all"));
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [frostDate, setFrostDate] = useState(getLocal("frostDate", ""));
  const [sunRequirement, setSunRequirement] = useState(getLocal("sunRequirement", "all"));
  const [waterNeed, setWaterNeed] = useState(getLocal("waterNeed", "all"));
  const [soilPreference, setSoilPreference] = useState(getLocal("soilPreference", "all"));
  const [loading, setLoading] = useState(false);
  const [sowingCalendar, setSowingCalendar] = useState([]);
  const [sowingCalendarData, setSowingCalendarData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { setLocal("zone", zone); }, [zone]);
  useEffect(() => { setLocal("category", category); }, [category]);
  useEffect(() => { setLocal("frostDate", frostDate); }, [frostDate]);
  useEffect(() => { setLocal("sunRequirement", sunRequirement); }, [sunRequirement]);
  useEffect(() => { setLocal("waterNeed", waterNeed); }, [waterNeed]);
  useEffect(() => { setLocal("soilPreference", soilPreference); }, [soilPreference]);

  // === NEW: Handle crop search filtering using transformed crops object ===
  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      // Convert crops object to array of [name, data] pairs for filtering
      const cropArray = Object.entries(crops).map(([name, data]) => ({
        name,
        ...data,
        _raw: data // keep original structure for CropCard
      }));
      const matches = filterCrops(
        cropArray,
        { zone, category, sunRequirement, waterNeed, soilPreference },
        searchTerm
      );
      // Store as [name, data] for rendering CropCard
      const filtered = matches.map((crop) => [crop.name, crop._raw || crop]);
      setFilteredCrops(filtered);
      setSowingCalendar(buildSowingCalendar(matches));
      setLoading(false);
      window.localStorage.setItem("sowingCalendar", JSON.stringify(matches));
    }, 150);
  };

  // Home screen
  if (screen === "home") {
    return (
      <div style={{
        fontFamily: "Poppins, sans-serif",
        padding: "1rem",
        margin: "0 auto",
        backgroundColor: "#fdfdfc",
        maxWidth: "100%",
      }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "2rem", color: "#2d6a4f" }}>
            🌱 Welcome to The Dibby Grow Buddy Garden Planner
          </h1>
          <p style={{ fontSize: "1.1rem", margin: "1rem 0" }}>
            Plan what to grow, when to sow with your frost date, grow zone look-up, specific planting depths and spacings, and a whole lot more.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
            <button onClick={() => setScreen("search")}
              style={{
                padding: "1rem 2rem", fontSize: "1rem", backgroundColor: "#5271ff",
                color: "white", border: "none", borderRadius: "8px", cursor: "pointer", minWidth: "200px"
              }}>
              Start Planning
            </button>
            <button onClick={() => setScreen("tools")}
              style={{
                padding: "1rem 2rem", fontSize: "1rem", backgroundColor: "#ffeb48",
                color: "black", border: "none", borderRadius: "8px", cursor: "pointer", minWidth: "200px"
              }}>
              Get Tools and Supplies
            </button>
            <button onClick={() => setScreen("videos")}
              style={{
                padding: "1rem 2rem", fontSize: "1rem", backgroundColor: "#05b210",
                color: "white", border: "none", borderRadius: "8px", cursor: "pointer", minWidth: "200px"
              }}>
              Watch Planting Videos
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "tools") {
    return <ToolsAndSupplies onBack={() => setScreen("home")} />;
  }

  if (screen === "videos") {
    return <PlantingVideos onBack={() => setScreen("home")} />;
  }

  // Crop search/planner screen
  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        padding: "1rem",
        margin: "0 auto",
        backgroundColor: "#fdfdfc",
        maxWidth: "100%",
        minHeight: 600,
      }}
    >
      {/* Top Left Back Button */}
      <div style={{ position: "absolute", top: 20, left: 20 }}>
        <BackHomeButton onClick={() => setScreen("home")} />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{
          display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "500px"
        }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#2d6a4f", textAlign: "center" }}>
            🌱 The Dibby Grow Buddy Garden Planner
          </h1>
          <label>
            Grow Zone:
            <input
              type="text"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </label>
          <label>
            Last Frost Date:
            <input
              type="date"
              value={frostDate}
              onChange={(e) => setFrostDate(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </label>
          <label>
            Category:
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
              <option value="all">All</option>
              <option value="flower">Flowers</option>
              <option value="herb">Herbs</option>
              <option value="vegetable">Vegetables</option>
            </select>
          </label>
          <label>
            Sun Requirement:
            <select value={sunRequirement} onChange={(e) => setSunRequirement(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
              <option value="all">All</option>
              <option value="full sun">Full Sun</option>
              <option value="part shade">Part Shade</option>
              <option value="full shade">Full Shade</option>
            </select>
          </label>
          <label>
            Water Need:
            <select value={waterNeed} onChange={(e) => setWaterNeed(e.target.value)} style={{ width: "100%", padding: "0.5rem" }}>
              <option value="all">All</option>
              <option value="loamy">Loamy</option>
              <option value="sandy">Sandy</option>
              <option value="clay">Clay</option>
              <option value="well-drained">Well-drained</option>
            </select>
          </label>
          <button
            onClick={handleSearch}
            style={{
              backgroundColor: "#40916c",
              color: "white",
              padding: "0.75rem",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              cursor: "pointer"
            }}>
            Find Crops
          </button>
        </div>
      </div>
      {!loading && (
        <>
          <h2 style={{ color: "#2d6a4f", marginTop: "2rem" }}>
            {filteredCrops.length} Crop{filteredCrops.length !== 1 ? "s" : ""} Found:
          </h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
            {filteredCrops.map(([cropName, cropData]) => (
              <li key={cropName} style={{ width: "100%", maxWidth: 700, marginBottom: "1rem" }}>
                <CropCard cropName={cropName} cropData={cropData} />
              </li>
            ))}
          </ul>
        </>
      )}
      {loading && <div style={{ color: "#b7b7b7", textAlign: "center", marginTop: "2rem" }}>Loading...</div>}
    </div>
  );
}
