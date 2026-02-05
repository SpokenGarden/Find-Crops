import React, { useState, useEffect, useMemo } from "react";
import { filterCrops } from "./utils/filterCrops";
import { buildSowingCalendar } from "./utils/sowingCalendar";
import CropCard from "./components/CropCard";
import ToolsAndSupplies from "./components/ToolsAndSupplies";
import PlantingVideos from "./components/PlantingVideos";
import { useCropData } from "./hooks/useCropData";

// ===== LOCAL STORAGE HELPERS =====
const isBrowser = typeof window !== "undefined";

const getLocal = (key, fallback) => {
  if (!isBrowser) return fallback;
  try {
    const val = window.localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const setLocal = (key, value) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

// ===== CUSTOM HOOK FOR PERSISTENT STATE =====
const usePersistentState = (key, initialValue) => {
  const [state, setState] = useState(() => getLocal(key, initialValue));
  
  useEffect(() => {
    setLocal(key, state);
  }, [state, key]);
  
  return [state, setState];
};

// ===== STYLES =====
const responsiveStyles = `
  .gp-container { max-width: 980px; margin: 0 auto; padding: 1.2rem; font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
  .gp-back-btn { background: transparent; border: none; color: #2d6a4f; font-weight: 700; margin-bottom: 0.8rem; cursor: pointer; }
  .gp-flex-center { display: flex; justify-content: center; }
  .gp-form-col { width: 100%; max-width: 360px; background: #ffffff; border-radius: 12px; padding: 0.9rem 1rem; box-shadow: 0 6px 18px rgba(17,24,39,0.06); margin: 0 auto; }
  .gp-label { display: block; margin-bottom: 0.6rem; color: #2d6a4f; font-weight: 600; font-size: 0.95rem; }
  .gp-input, .gp-select { width: 100%; padding: 0.45rem 0.6rem; border-radius: 8px; border: 1px solid #e6e6e6; font-size: 0.95rem; margin-top: 0.25rem; box-sizing: border-box; }
  .gp-find-btn { margin-top: 0.9rem; width: 100%; padding: 0.6rem; background: #2d6a4f; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 0.98rem; }
  .gp-toggle-advanced { margin: 0.5rem 0; }
  .gp-groups-row { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; align-items: flex-start; margin-top: 1rem; margin-bottom: 1rem; }
  .gp-group-box { display: flex; flex-direction: column; align-items: center; width: auto; min-width: 120px; }
  .gp-group-header { display: inline-flex; align-items: center; justify-content: space-between; gap: 0.6rem; padding: 0.45rem 0.8rem; background: #eef7f0; border: 1px solid #dbeeda; border-radius: 10px; cursor: pointer; box-sizing: border-box; font-weight: 700; color: #2d6a4f; min-width: 0; white-space: nowrap; }
  .gp-group-header:focus { outline: 3px solid rgba(45,106,79,0.15); }
  .gp-group-list { list-style: none; padding-left: 0; margin-top: 0.6rem; margin-left: auto; margin-right: auto; width: 100%; max-width: 720px; box-sizing: border-box; }
  .gp-group-item { margin: 0.6rem 0; }
  .gp-empty { text-align:center; color:#9aa5a0; margin-top:1.5rem; }
  
  @media (min-width: 760px) {
    .gp-form-col { padding: 1rem 1.2rem; }
    .gp-group-list { max-width: 720px; }
  }
`;

// ===== UTILITY FUNCTIONS =====
const getCropType = (cData) => {
  if (!cData) return "other";
  
  // Check Basics array for type field
  if (cData.Basics && Array.isArray(cData.Basics)) {
    const typeField = cData.Basics.find(
      (f) => f.label && typeof f.label === "string" && f.label.toLowerCase() === "type"
    );
    if (typeField && typeField.value) {
      const val = (typeof typeField.value === "string" ? typeField.value : String(typeField.value)).toLowerCase();
      if (val.includes("flower")) return "flower";
      if (val.includes("vegetable") || val.includes("veggie")) return "vegetable";
      if (val.includes("herb")) return "herb";
      if (val.includes("bulb")) return "bulb";
      return val || "other";
    }
  }
  
  // Fallback: check category field
  if (cData.category) {
    const val = String(cData.category).toLowerCase();
    if (val.includes("flower")) return "flower";
    if (val.includes("vegetable")) return "vegetable";
    if (val.includes("herb")) return "herb";
    if (val.includes("bulb")) return "bulb";
  }
  
  return "other";
};

const getGroupLabel = (group) => {
  const labels = {
    flower: "Flowers",
    vegetable: "Vegetables",
    herb: "Herbs",
    bulb: "Bulbs"
  };
  return labels[group] || group;
};

// ===== MAIN COMPONENT =====
export default function GardenPlannerApp() {
  // UI state
  const [screen, setScreen] = useState("search");
  const [dropdown1Open, setDropdown1Open] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  // Crop search state with persistence
  const [zone, setZone] = usePersistentState("zone", "");
  const [category, setCategory] = usePersistentState("category", "all");
  const [frostDate, setFrostDate] = usePersistentState("frostDate", "");
  const [sunRequirement, setSunRequirement] = usePersistentState("sunRequirement", "all");
  const [waterNeed, setWaterNeed] = usePersistentState("waterNeed", "all");
  const [soilPreference, setSoilPreference] = usePersistentState("soilPreference", "all");
  const [sowingCalendar, setSowingCalendar] = usePersistentState("sowingCalendar", []);
  
  // Non-persistent state
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [cropName, setCropName] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({
    flower: false,
    vegetable: false,
    herb: false,
    bulb: false,
  });

  // Get crop data
  const { cropData, loading: cropDataLoading, error: cropDataError } = useCropData();

  // ===== HANDLERS =====
  const handleSearch = () => {
    if (!cropData) return;
    setLoading(true);

    setTimeout(() => {
      const cropArray = Object.entries(cropData).map(([name, data]) => ({
        name,
        ...data,
        _raw: data
      }));

      const matches = filterCrops(cropArray, {
        cropName,
        zone,
        category,
        sunRequirement,
        waterNeed,
        soilPreference
      });

      const filtered = matches.map((crop) => [crop.name, crop._raw || crop]);

      setFilteredCrops(filtered);
      setSowingCalendar(buildSowingCalendar(matches));
      setLoading(false);

      // Reset group expansion to all collapsed
      setExpandedGroups({ flower: false, vegetable: false, herb: false, bulb: false });
    }, 150);
  };

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // ===== COMPUTED VALUES =====
  const groupedCrops = useMemo(() => {
    const groups = { flower: [], vegetable: [], herb: [], bulb: [], other: [] };
    filteredCrops.forEach(([cName, cData]) => {
      const type = getCropType(cData);
      if (groups[type]) groups[type].push([cName, cData]);
      else groups.other.push([cName, cData]);
    });

  // Sort each group alphabetically by crop name
  Object.keys(groups).forEach((key) => {
    groups[key].sort((a, b) => a[0].localeCompare(b[0]));
  });
    
    return groups;
  }, [filteredCrops]);

  const totalCount = filteredCrops.length;
  const flowerCount = groupedCrops.flower.length;
  const vegetableCount = groupedCrops.vegetable.length;
  const herbCount = groupedCrops.herb.length;
  const bulbCount = groupedCrops.bulb.length;

  // ===== RENDER HOME SCREEN =====
  if (screen === "home") {
    return (
      <div className="gp-container">
        <style>{responsiveStyles}</style>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "2rem", color: "#2d6a4f" }}>
            🌱 Welcome to The Dibby Grow Buddy Garden Planner
          </h1>
          <p style={{ fontSize: "1.05rem", margin: "1rem 0", color: "#385e4f" }}>
            Plan what to grow, when to sow with your frost date, grow zone look-up, planting depths & spacings, and more.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginTop: "1.75rem" }}>
            <button
              onClick={() => setScreen("search")}
              style={{ padding: "0.9rem 1.6rem", fontSize: "1rem", backgroundColor: "#5271ff", color: "white", border: "none", borderRadius: "12px", cursor: "pointer" }}
            >
              Start Planning
            </button>
            <button
              onClick={() => setScreen("tools")}
              style={{ padding: "0.9rem 1.6rem", fontSize: "1rem", backgroundColor: "#ffeb48", color: "black", border: "none", borderRadius: "12px", cursor: "pointer" }}
            >
              Tools & Supplies
            </button>
            <button
              onClick={() => setScreen("videos")}
              style={{ padding: "0.9rem 1.6rem", fontSize: "1rem", backgroundColor: "#05b210", color: "white", border: "none", borderRadius: "12px", cursor: "pointer" }}
            >
              Planting Videos
            </button>
          </div>
        </div>

        {/* Dropdown sections */}
        <div style={{ marginTop: "2rem" }}>
          <div className="gp-dropdown-section" style={{ marginTop: "2rem" }}>
            <div className="gp-dropdown-container">
              <button
                className="gp-find-btn"
                type="button"
                onClick={() => setDropdown1Open(!dropdown1Open)}
              >
                Dropdown 1 ▼
              </button>
              {dropdown1Open && (
                <div className="gp-dropdown-text">
                  <p>
                    All in one place, find what plants to sow or plant! Know when to sow or plant indoors or outdoors and what season. 
                    Get the right seed sowing and bulb planting depth and much more! For flowers, vegetables, bulbs, and herbs!
                    <br /><br />
                    Plan what to grow, when to sow with your frost date, grow zone look-up, specific planting depths and spacings, and a whole lot more.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="gp-dropdown-section" style={{ marginTop: "1rem" }}>
            <div className="gp-dropdown-container">
              <button
                className="gp-find-btn"
                type="button"
                onClick={() => setDropdown2Open(!dropdown2Open)}
              >
                Dropdown 2 ▼
              </button>
              {dropdown2Open && (
                <div className="gp-dropdown-text">
                  <p>
                    We got tired of looking through 3 or more different sources trying to find basic seed sowing information all the time, 
                    so we made this tool for us to easily access and use when we need the info, and it's for you to use, too!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDER OTHER SCREENS =====
  if (screen === "tools") return <ToolsAndSupplies onBack={() => setScreen("home")} />;
  if (screen === "videos") return <PlantingVideos onBack={() => setScreen("home")} />;

  // ===== RENDER SEARCH SCREEN =====
  if (screen === "search") {
    if (cropDataLoading) {
      return (
        <div className="gp-container">
          <style>{responsiveStyles}</style>
          <div style={{ color: "#b7b7b7", textAlign: "center", marginTop: "2rem" }}>
            Loading plant data...
          </div>
        </div>
      );
    }

    if (cropDataError) {
      return (
        <div className="gp-container">
          <style>{responsiveStyles}</style>
          <div style={{ color: "#b72b2b", textAlign: "center", marginTop: "2rem" }}>
            Error loading plant data: {String(cropDataError)}
          </div>
        </div>
      );
    }

    if (!cropData) {
      return (
        <div className="gp-container">
          <style>{responsiveStyles}</style>
          <div style={{ color: "#b7b7b7", textAlign: "center", marginTop: "2rem" }}>
            No plant data available.
          </div>
        </div>
      );
    }

    return (
      <div className="gp-container">
        <style>{responsiveStyles}</style>

        <button
          className="gp-back-btn"
          onClick={() => (window.location.href = "https://www.spokengarden.com")}
        >
          ← Back to Home
        </button>

        <div className="gp-flex-center">
          <form
            className="gp-form-col"
            role="region"
            aria-label="Garden Planner search form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <h1 style={{ fontSize: "1.25rem", marginBottom: "0.6rem", color: "#2d6a4f", textAlign: "center" }}>
              🌱 Find Seeds and Plants to Grow Next
            </h1>

            {/* Plant Name Search */}
            <label className="gp-label">
              Plant Name Search:
              <input
                type="text"
                value={cropName}
                placeholder="Type a plant name (e.g. radish, zinnia)…"
                onChange={(e) => setCropName(e.target.value)}
                className="gp-input"
                autoFocus
              />
            </label>

            {/* Toggle Advanced Filters */}
            <button
              type="button"
              onClick={() => setShowAdvancedFilters((prev) => !prev)}
              className="gp-toggle-advanced"
              style={{
                background: "#eaf4ec",
                border: "2px solid #2d6a4f",
                borderRadius: "10px",
                padding: "0.45em 0.6em",
                cursor: "pointer",
                fontWeight: 700,
                color: "#2d6a4f",
                fontSize: "0.95rem",
                margin: "0.4em 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%"
              }}
            >
              <span>{showAdvancedFilters ? "Hide Advanced Filters ▲" : "Show Advanced Filters ▼"}</span>
            </button>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div style={{ marginTop: "0.4rem" }}>
                <label className="gp-label">
                  Grow Zone:
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
                    <option value="moderate">Moderate</option>
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
              </div>
            )}

            {/* Find Plants Button */}
            <button className="gp-find-btn" type="submit">
              Find Plants
            </button>
          </form>
        </div>

        {/* Results area */}
        {!loading && (
          <>
            {totalCount > 0 && (
              <div style={{ marginTop: "1rem", marginBottom: "0.6rem", color: "#2d6a4f", textAlign: "center" }}>
                <h2 style={{ margin: 0, fontSize: "1.05rem" }}>
                  {totalCount} Plant{totalCount !== 1 ? "s" : ""} Found
                </h2>
                <div style={{ marginTop: "0.3rem", fontSize: "0.95rem", color: "#375e4e" }}>
                  Flowers: {flowerCount} &nbsp;|&nbsp; Vegetables: {vegetableCount} &nbsp;|&nbsp; 
                  Herbs: {herbCount} &nbsp;|&nbsp; Bulbs: {bulbCount}
                </div>
              </div>
            )}

            {/* Group headers */}
            <div className="gp-groups-row" role="list">
              {["flower", "vegetable", "herb", "bulb"].map((group) =>
                groupedCrops[group].length > 0 ? (
                  <div key={group} className="gp-group-box" role="listitem">
                    <div
                      onClick={() => toggleGroup(group)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleGroup(group);
                        }
                      }}
                      tabIndex={0}
                      className="gp-group-header"
                      style={{ outline: "none" }}
                      aria-expanded={expandedGroups[group]}
                      role="button"
                      aria-controls={`gp-group-${group}`}
                    >
                      <span style={{ fontSize: "0.95rem" }}>
                        {getGroupLabel(group)} ({groupedCrops[group].length})
                      </span>
                      <span style={{ fontSize: "1.05em" }}>
                        {expandedGroups[group] ? "▲" : "▼"}
                      </span>
                    </div>

                    {expandedGroups[group] && (
                      <ul id={`gp-group-${group}`} className="gp-group-list" aria-live="polite">
                        {groupedCrops[group].map(([cName, cData]) => (
                          <li key={cName} className="gp-group-item">
                            <CropCard cropName={cName} cropData={cData} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null
              )}
            </div>

            {filteredCrops.length === 0 && (
              <div className="gp-empty">No crops found for your search.</div>
            )}
          </>
        )}

        {loading && (
          <div style={{ color: "#b7b7b7", textAlign: "center", marginTop: "1.5rem" }}>
            Loading...
          </div>
        )}
      </div>
    );
  }

  return null;
}
