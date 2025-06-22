import React, { useState, useEffect } from "react";
import { filterCrops } from "./utils/filterCrops";
import CropCard from "./components/CropCard";
import ToolsAndSupplies from "./components/ToolsAndSupplies";
import PlantingVideos from "./components/PlantingVideos";
import BackHomeButton from "./components/BackHomeButton";
import BottomAdBanner from "./components/BottomAdBanner";

// Local storage helpers
const getLocal = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
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

// Category file mapping
const CATEGORY_FILES = {
  flower: "/flowers.json",
  vegetable: "/vegetables.json",
  herb: "/herbs.json",
  bulb: "/bulbs.json",
};

const CATEGORY_LABELS = {
  flower: "Flowers",
  vegetable: "Vegetables",
  herb: "Herbs",
  bulb: "Bulbs",
};

export default function GardenPlannerApp() {
  // UI state
  const [screen, setScreen] = useState("home");

  // Crop search state
  const [zone, setZone] = useState(getLocal("zone", ""));
  const [category, setCategory] = useState(getLocal("category", "all"));
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [frostDate, setFrostDate] = useState(getLocal("frostDate", ""));
  const [sunRequirement, setSunRequirement] = useState(getLocal("sunRequirement", "all"));
  const [waterNeed, setWaterNeed] = useState(getLocal("waterNeed", "all"));
  const [soilPreference, setSoilPreference] = useState(getLocal("soilPreference", "all"));
  const [loading, setLoading] = useState(false);
  const [cropName, setCropName] = useState("");

  // Crop data state (by category)
  const [cropData, setCropData] = useState({});
  const [cropDataLoading, setCropDataLoading] = useState(false);
  const [cropDataError, setCropDataError] = useState(null);

  // Accordion state for group expansion (start all collapsed)
  const [expandedGroups, setExpandedGroups] = useState({
    flower: false,
    vegetable: false,
    herb: false,
    bulb: false,
  });

  // Load crop data for selected category (or all)
  useEffect(() => {
    setCropDataLoading(true);
    setCropDataError(null);

    const fetchCategoryFile = async (cat) => {
      const response = await fetch(CATEGORY_FILES[cat]);
      if (!response.ok) throw new Error(`Failed to load ${CATEGORY_LABELS[cat]} data`);
      return response.json();
    };

    let isMounted = true;

    (async () => {
      try {
        let result = {};
        if (category === "all") {
          // Load all categories in parallel
          const cats = Object.keys(CATEGORY_FILES);
          const loaded = await Promise.all(
            cats.map(cat => fetchCategoryFile(cat))
          );
          cats.forEach((cat, idx) => {
            result[cat] = loaded[idx];
          });
        } else {
          // Only load selected category
          result[category] = await fetchCategoryFile(category);
        }
        if (isMounted) setCropData(result);
      } catch (err) {
        if (isMounted) setCropDataError(err);
      } finally {
        if (isMounted) setCropDataLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, [category]);

  useEffect(() => { setLocal("zone", zone); }, [zone]);
  useEffect(() => { setLocal("category", category); }, [category]);
  useEffect(() => { setLocal("frostDate", frostDate); }, [frostDate]);
  useEffect(() => { setLocal("sunRequirement", sunRequirement); }, [sunRequirement]);
  useEffect(() => { setLocal("waterNeed", waterNeed); }, [waterNeed]);
  useEffect(() => { setLocal("soilPreference", soilPreference); }, [soilPreference]);

  // Search/filter logic, now works with grouped cropData
  const handleSearch = () => {
    if (!cropData) return;
    setLoading(true);
    setTimeout(() => {
      let filtered = [];
      Object.entries(cropData).forEach(([cat, data]) => {
        // Convert each category's crop object to array for filtering
        const cropArray = Object.entries(data).map(([name, d]) => ({
          name,
          ...d,
          _raw: d,
        }));
        const matches = filterCrops(
          cropArray,
          { cropName, zone, category: category === "all" ? cat : category, sunRequirement, waterNeed, soilPreference }
        );
        matches.forEach(crop => {
          filtered.push([crop.name, crop._raw || crop]);
        });
      });
      setFilteredCrops(filtered);
      setLoading(false);
      // Reset group expansion to all collapsed on new search:
      setExpandedGroups({
        flower: false,
        vegetable: false,
        herb: false,
        bulb: false,
      });
    }, 150);
  };

  // Helper to get the type/category from the crop's data
  function getCropType(cropData) {
    if (cropData.Basics && Array.isArray(cropData.Basics)) {
      const typeField = cropData.Basics.find(f => f.label && f.label.toLowerCase() === "type");
      return typeField ? typeField.value.toLowerCase() : "other";
    }
    return "other";
  }

  // Group filtered crops by type
  const groupedCrops = { flower: [], vegetable: [], herb: [], bulb: [], other: [] };
  filteredCrops.forEach(([cropName, cropData]) => {
    const type = getCropType(cropData);
    if (groupedCrops[type]) {
      groupedCrops[type].push([cropName, cropData]);
    } else {
      groupedCrops.other.push([cropName, cropData]);
    }
  });

  // *** Alphabetize each group in-place ***
  Object.keys(groupedCrops).forEach(group => {
    groupedCrops[group].sort((a, b) =>
      a[0].localeCompare(b[0], undefined, { sensitivity: 'base' })
    );
  });

  // Counts
  const totalCount = filteredCrops.length;
  const flowerCount = groupedCrops.flower.length;
  const vegetableCount = groupedCrops.vegetable.length;
  const herbCount = groupedCrops.herb.length;
  const bulbCount = groupedCrops.bulb.length;

  // Accordion group toggler
  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // Responsive styles block from the old App.js
  const responsiveStyles = `
    .gp-container {
      font-family: 'Poppins', sans-serif;
      padding: 1.2rem 0;
      margin: 0 auto;
      background-color: #fdfdfc;
      min-height: 600px;
      max-width: 600px;
      width: 100vw;
      box-sizing: border-box;
      overflow-x: hidden;
    }
    .gp-flex-center {
      display: flex;
      justify-content: center;
      width: 100%;
    }
    .gp-form-col {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
      background: none;
      padding: 0;
    }
    .gp-input, .gp-select {
      width: 100%;
      max-width: 100%;
      font-size: 1.05rem;
      padding: 0.65em 1em;
      border: 2px solid #228b22;
      border-radius: 9px;
      outline: none;
      background: #f3fcf7;
      color: #155943;
      box-sizing: border-box;
      margin-bottom: 1em;
    }
    .gp-label {
      font-weight: 600;
      margin-bottom: 0.3em;
      font-size: 1.08rem;
    }
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
    .gp-find-btn {
      background-color: #40916c;
      color: white;
      padding: 1rem;
      border: none;
      border-radius: 12px;
      font-size: 1.07rem;
      cursor: pointer;
      margin-top: 1em;
      margin-bottom: 0.5em;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      font-weight: 600;
    }
    .gp-group-header {
      cursor: pointer;
      background: #eaf4ec;
      border: 2px solid #2d6a4f;
      border-radius: 10px;
      padding: 1em 1.5em;
      font-weight: 700;
      color: #2d6a4f;
      font-size: 1.3rem;
      box-shadow: 0 2px 12px rgba(44, 106, 79, 0.07);
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-left: auto;
      margin-right: auto;
      max-width: 500px;
      width: 100%;
      box-sizing: border-box;
      transition: background 0.15s;
    }
    .gp-group-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 700px;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
    }
    .gp-group-item {
      width: 100%;
      max-width: 700px;
      margin-bottom: 1rem;
    }
    .crop-card {
      margin-left: auto;
      margin-right: auto;
      width: 100%;
    }

    @media (max-width: 900px) {
      .gp-container {
        max-width: 99vw;
      }
      .gp-form-col,
      .gp-group-header,
      .gp-group-list,
      .crop-card {
        max-width: 95vw;
        padding-left: 2vw;
        padding-right: 2vw;
        box-sizing: border-box;
      }
    }
    @media (max-width: 700px) {
      .gp-container {
        padding-left: 3vw;
        padding-right: 3vw;
      }
      .gp-form-col,
      .gp-group-header,
      .gp-group-list,
      .crop-card {
        max-width: 95vw;
        padding-left: 2vw;
        padding-right: 2vw;
        box-sizing: border-box;
      }
      .gp-group-header {
        font-size: 1.07rem;
        padding: 0.7em 1em;
      }
      .gp-group-item {
        max-width: 99vw;
        min-width: 0;
      }
      .gp-back-btn {
        position: static;
        display: block;
        margin-bottom: 0.85em;
        margin-left: 0;
        margin-top: 0.5em;
        width: auto;
      }
      .gp-form-col {
        padding-top: 0.3em;
      }
    }
    @media (max-width: 480px) {
      .gp-container {
        padding-left: 2vw;
        padding-right: 2vw;
      }
      .gp-form-col,
      .gp-group-header,
      .gp-group-list,
      .crop-card {
        max-width: 98vw;
        padding-left: 2vw;
        padding-right: 2vw;
      }
      .gp-back-btn {
        font-size: 1rem;
        padding: 0.6em 1em;
      }
      .gp-input, .gp-select {
        font-size: 0.97rem;
        padding: 0.55em 0.5em;
      }
    }
  `;

  // Home screen
  if (screen === "home") {
    return (
      <div className="gp-container">
        <style>{responsiveStyles}</style>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "2rem", color: "#2d6a4f" }}>
            🌱 Welcome to The Dibby Grow Buddy Garden Planner
          </h1>
          <p style={{ fontSize: "1.1rem", margin: "1rem 0" }}>
            Plan what to grow, when to sow with your frost date, grow zone look-up, specific planting depths and spacings, and a whole lot more.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", marginTop: "2rem" }}>
            <button
              onClick={() => setScreen("search")}
              style={{
                padding: "1rem 2rem",
                fontSize: "1rem",
                backgroundColor: "#5271ff",
                color: "white",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                minWidth: "200px",
                transition: "box-shadow 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}>
              Find Plants
            </button>
            <button
              onClick={() => setScreen("tools")}
              style={{
                padding: "1rem 2rem",
                fontSize: "1rem",
                backgroundColor: "#ffeb48",
                color: "black",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                minWidth: "200px",
                transition: "box-shadow 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}>
              Get Tools and Supplies
            </button>
            <button
              onClick={() => setScreen("videos")}
              style={{
                padding: "1rem 2rem",
                fontSize: "1rem",
                backgroundColor: "#05b210",
                color: "white",
                border: "none",
                borderRadius: "16px",
                cursor: "pointer",
                minWidth: "200px",
                transition: "box-shadow 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}>
              Watch Planting Videos
            </button>
          </div>
        </div>
        <BottomAdBanner />
      </div>
    );
  }

  if (screen === "tools") {
    return (
      <div className="gp-container">
        <style>{responsiveStyles}</style>
        <ToolsAndSupplies onBack={() => setScreen("home")} />
        <BottomAdBanner />
      </div>
    );
  }

  if (screen === "videos") {
    return (
      <div className="gp-container">
        <style>{responsiveStyles}</style>
        <PlantingVideos onBack={() => setScreen("home")} />
        <BottomAdBanner />
      </div>
    );
  }

  // Crop search/planner screen
  if (screen === "search") {
    // --- Show loading or error state for crop data fetch ---
    if (cropDataLoading) {
      return (
        <div className="gp-container" style={{ paddingBottom: "100px" }}>
          <style>{responsiveStyles}</style>
          <div style={{ color: "#b7b7b7", textAlign: "center", marginTop: "2rem" }}>Loading plant data...</div>
          <BottomAdBanner />
        </div>
      );
    }
    if (cropDataError) {
      return (
        <div className="gp-container" style={{ paddingBottom: "100px" }}>
          <style>{responsiveStyles}</style>
          <div style={{ color: "#b72b2b", textAlign: "center", marginTop: "2rem" }}>
            Error loading plant data: {cropDataError.message}
          </div>
          <BottomAdBanner />
        </div>
      );
    }
    if (!cropData) {
      return (
        <div className="gp-container">
          <style>{responsiveStyles}</style>
          <div style={{ color: "#b7b7b7", textAlign: "center", marginTop: "2rem" }}>No plant data available.</div>
          <BottomAdBanner />
        </div>
      );
    }

    return (
      <div className="gp-container">
        <style>{responsiveStyles}</style>
        <button
          className="gp-back-btn"
          onClick={() => setScreen("home")}
        >← Back to Home</button>
        <div className="gp-flex-center">
          <div className="gp-form-col">
            <h1 style={{
              fontSize: "1.45rem",
              marginBottom: "1rem",
              color: "#2d6a4f",
              textAlign: "center"
            }}>
              🌱 The Dibby Grow Buddy Garden Planner
            </h1>
            {/* Search Fields */}
            <label className="gp-label">
              Plant Name Search:
              <input
                type="text"
                value={cropName}
                placeholder="Type a plant name (e.g. radish, zinnia)…"
                onChange={e => setCropName(e.target.value)}
                className="gp-input"
                autoFocus
              />
            </label>
            <div style={{
              textAlign: "center",
              fontWeight: 700,
              color: "#297c5e",
              margin: "0.3em 0 0.7em 0",
              fontSize: "1.17rem"
            }}>
              OR
            </div>
            <label className="gp-label">
              Hardy Zone:
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="gp-input"
              />
            </label>
            <label className="gp-label">
              Last Frost Date:
              <input
                type="date"
                value={frostDate}
                onChange={(e) => setFrostDate(e.target.value)}
                className="gp-input"
              />
            </label>
            <label className="gp-label">
              Category:
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="gp-select"
              >
                <option value="all">All</option>
                <option value="flower">Flowers</option>
                <option value="herb">Herbs</option>
                <option value="vegetable">Vegetables</option>
                <option value="bulb">Bulbs</option>
              </select>
            </label>
            <label className="gp-label">
              Sun Requirement:
              <select
                value={sunRequirement}
                onChange={(e) => setSunRequirement(e.target.value)}
                className="gp-select"
              >
                <option value="all">All</option>
                <option value="full sun">Full Sun</option>
                <option value="part shade">Part Shade</option>
                <option value="full shade">Full Shade</option>
              </select>
            </label>
            <label className="gp-label">
              Water Need:
              <select
                value={waterNeed}
                onChange={(e) => setWaterNeed(e.target.value)}
                className="gp-select"
              >
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="gp-label">
              Soil Preference:
              <select
                value={soilPreference}
                onChange={(e) => setSoilPreference(e.target.value)}
                className="gp-select"
              >
                <option value="all">All</option>
                <option value="loamy">Loamy</option>
                <option value="sandy">Sandy</option>
                <option value="clay">Clay</option>
                <option value="well-drained">Well-drained</option>
              </select>
            </label>
            <button
              className="gp-find-btn"
              onClick={handleSearch}
            >Find Plants</button>
          </div>
        </div>
        {/* Results */}
        {!loading && (
          <>
            {/* Search summary */}
            {totalCount > 0 && (
              <div style={{ marginTop: "2rem", marginBottom: "1.5rem", color: "#2d6a4f", textAlign: "center" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem" }}>
                  {totalCount} Plant{totalCount !== 1 ? "s" : ""} Found
                </h2>
                <div style={{ marginTop: "0.5rem", fontSize: "1.05rem" }}>
                  Flowers: {flowerCount} &nbsp;|&nbsp; Vegetables: {vegetableCount} &nbsp;|&nbsp; Herbs: {herbCount} &nbsp;|&nbsp; Bulbs: {bulbCount}
                </div>
              </div>
            )}

            {/* Grouped Crop Lists as Accordions */}
            {["flower", "vegetable", "herb", "bulb"].map(group => (
              groupedCrops[group].length > 0 && (
              <div style={{ paddingBottom: "100px" }}>
                <div key={group} style={{ marginBottom: "2em", width: "100%" }}>
                  {/* Accordion Group Header */}
                  <div
                    onClick={() => toggleGroup(group)}
                    tabIndex={0}
                    className="gp-group-header"
                    style={{ outline: "none" }}
                    aria-expanded={expandedGroups[group]}
                    role="button"
                  >
                    <span>
                      {CATEGORY_LABELS[group]}
                      {" "}({groupedCrops[group].length})
                    </span>
                    <span style={{ fontSize: "1.2em" }}>
                      {expandedGroups[group] ? "▲" : "▼"}
                    </span>
                  </div>
                  {/* Accordion content */}
                  {expandedGroups[group] && (
                    <ul className="gp-group-list">
                      {groupedCrops[group].map(([cropName, cropData]) => (
                        <li key={cropName} className="gp-group-item">
                          <CropCard cropName={cropName} cropData={cropData} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              )
            ))}
            {/* None found */}
            {filteredCrops.length === 0 && (
              <div style={{ color: "#b7b7b7", textAlign: "center", marginTop: "2rem" }}>
                No crops found for your search.
              </div>
            )}
          </>
        )}
        {loading && <div style={{ color: "#b7b7b7", textAlign: "center", marginTop: "2rem" }}>Loading...</div>}
        <BottomAdBanner />
      </div>
    );
  }

  // Default fallback
  return null;
}
