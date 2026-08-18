import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { filterCrops } from "./utils/filterCrops";
import { buildSowingCalendar } from "./utils/sowingCalendar";
import CropCard from "./components/CropCard";
import ToolsAndSupplies from "./components/ToolsAndSupplies";
import PlantingVideos from "./components/PlantingVideos";
import { useCropData } from "./hooks/useCropData";
import dibbyYellow from "./images/dibby-yellow.jpg";

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
  .gp-empty {
    max-width: 540px;
    margin: 1.5rem auto 0;
    padding: 1rem 1.1rem;
    text-align: center;
    color: #466757;
    background: #f6fbf7;
    border: 1px solid #dbeeda;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(17,24,39,0.04);
  }
  .gp-empty h3 { margin: 0 0 0.35rem 0; color: #2d6a4f; font-size: 1rem; }
  .gp-empty p { margin: 0; font-size: 0.95rem; line-height: 1.5; }
  .gp-empty-actions { display: flex; justify-content: center; gap: 0.65rem; flex-wrap: wrap; margin-top: 0.85rem; }
  .gp-empty-btn {
    border: 1px solid #bddfcd;
    background: #ffffff;
    color: #245a45;
    border-radius: 999px;
    padding: 0.55rem 0.9rem;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
  }
  .gp-version-badge { display: inline-block; padding: 0.3rem 0.7rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; margin-left: 0.5rem; vertical-align: middle; }
  .gp-version-lite { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
  .gp-version-full { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
  /* ===== MODAL (for Dibby promo) ===== */
.gp-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 9999;
}

.gp-modal {
  width: 100%;
  max-width: 760px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 18px 60px rgba(0,0,0,0.25);
  padding: 0.9rem;
  position: relative;
}
.gp-modal { min-height: 140px; }
}
.gp-modal {
  width: 100%;
  max-width: 760px;
  background: #ffffff !important;
  border-radius: 16px;
  box-shadow: 0 18px 60px rgba(0,0,0,0.25);
  padding: 1rem;
  position: relative;
  min-height: 160px;            /* NEW */
  z-index: 10000;               /* NEW */
  opacity: 1 !important;        /* NEW */
  display: block !important;    /* NEW */
}

.gp-modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: rgba(0,0,0,0.06);
  border-radius: 10px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 900;
}
.gp-modal-close:hover {
  background: rgba(0,0,0,0.12);
}
   
  .gp-mode-selector { width: 100%; max-width: 360px; margin: 0 auto 0.8rem auto; text-align: center; }
  .gp-mode-selector h1 { font-size: 1.25rem; margin-bottom: 0.5rem; color: #2d6a4f; }
  .gp-mode-selector-subtitle { font-size: 0.85rem; font-weight: 400; color: #4a6b5a; }
/* ===== MODE BUTTON ROW: match search card width + larger buttons ===== */
.gp-mode-btn-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;                         /* looks like one segmented control */
  width: 100%;
  max-width: 360px;               /* matches gp-form-col max-width */
  margin: 0.75rem auto 0 auto;
  padding: 6px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(45, 106, 79, 0.22);
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(17, 24, 39, 0.06);
}

/* Make each button fill half the row */
.gp-mode-btn {
  flex: 1 1 0;
  width: 50%;
  padding: 0.85rem 0.75rem;       /* bigger click area */
  font-size: 1.02rem;             /* ~same as your h1 size */
  line-height: 1.1;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 900;
  border: 2px solid #2d6a4f;
  transition: transform 0.06s ease, background 0.2s ease, color 0.2s ease;
  border-width: 2px;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: flex-start;
  text-align: left;
}

/* Remove the "or" gap effect; let the container handle separation */
.gp-mode-btn:active {
  transform: scale(0.99);
}

.gp-mode-btn-active {
  background: #2d6a4f;
  color: #ffffff;
}

.gp-mode-btn-inactive {
  background: rgba(45, 106, 79, 0.06);
  color: #2d6a4f;
}
.gp-mode-btn-title { font-size: 1rem; }
.gp-mode-btn-copy { font-size: 0.74rem; font-weight: 700; opacity: 0.9; }
.gp-loading-grid {
  display: grid;
  gap: 0.9rem;
  margin-top: 1rem;
}
.gp-loading-card {
  background: linear-gradient(135deg, #f3fcf7 0%, #e6f9ee 100%);
  border-radius: 22px;
  border: 1px solid #d0ede1;
  padding: 1rem;
  box-shadow: 0 4px 16px rgba(34,74,66,0.08);
}
.gp-loading-card-top {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}
.gp-loading-media,
.gp-loading-line {
  position: relative;
  overflow: hidden;
  background: #dfeee4;
}
.gp-loading-media::after,
.gp-loading-line::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent);
  animation: gpShimmer 1.3s infinite;
}
.gp-loading-media {
  width: 182px;
  flex: 0 0 182px;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
}
.gp-loading-lines { flex: 1; display: grid; gap: 0.7rem; }
.gp-loading-line { height: 14px; border-radius: 999px; }
.gp-loading-line-lg { height: 20px; width: 60%; }
.gp-loading-line-md { width: 82%; }
.gp-loading-line-sm { width: 48%; }
@keyframes gpShimmer {
  100% { transform: translateX(100%); }
}

@media (min-width: 760px) {
  .gp-form-col { padding: 1rem 1.2rem; }
  .gp-group-list { max-width: 720px; }
}

/* ===== MODE SELECTOR PANEL (planter-finder style separation) ===== */
.gp-mode-panel {
  width: 100%;
  max-width: 720px;
  margin: 0 auto 1rem auto;
  padding: 1.2rem 1.25rem;
  border-radius: 16px;
  background: linear-gradient(180deg, #f3f6fb 0%, #eef7f0 100%);
  border: 1px solid rgba(45, 106, 79, 0.18);
  box-shadow: 0 10px 28px rgba(17, 24, 39, 0.08);
}

.gp-mode-panel .gp-mode-selector {
  max-width: none;
  margin: 0;
}

@media (max-width: 640px) {
  .gp-mode-panel {
    padding: 0.9rem 0.85rem;
    border-radius: 14px;
  }
  .gp-loading-card-top {
    flex-direction: column;
  }
  .gp-loading-media {
    width: 100%;
    max-width: 240px;
    flex-basis: auto;
    align-self: center;
  }
}
/* ===== DIBBY BANNER STYLES (used inside modal) ===== */
.gp-dibby-banner {
  background: #eef7f0;
  border: 1px solid #dbeeda;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(45,106,79,0.08);
  min-height: 70px;
}

.gp-dibby-banner-image {
  width: 55px;
  height: 55px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #dbeeda;
  flex-shrink: 0;
}

.gp-dibby-banner-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.2rem;
}

.gp-dibby-banner-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #2d6a4f;
  margin: 0;
  line-height: 1.3;
}

.gp-dibby-banner-subtitle {
  font-size: 0.78rem;
  color: #4a6b5a;
  margin: 0;
  line-height: 1.3;
}

.gp-dibby-banner-btn {
  background: #2d6a4f;
  color: white;
  padding: 0.4rem 0.85rem;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.gp-dibby-banner-btn:hover {
  background: #05b210;
}
`;

function LoadingCards({ count = 3 }) {
  return (
    <div className="gp-loading-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className="gp-loading-card">
          <div className="gp-loading-card-top">
            <div className="gp-loading-media" />
            <div className="gp-loading-lines">
              <div className="gp-loading-line gp-loading-line-lg" />
              <div className="gp-loading-line gp-loading-line-md" />
              <div className="gp-loading-line" />
              <div className="gp-loading-line gp-loading-line-sm" />
              <div className="gp-loading-line gp-loading-line-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

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
  // ===== VERSION CONTROL =====
  // Change this to "grow" for the complete version with Growth and Care sections
  // "sow" = shows Basics + Sowing sections + Buy Now
  // "grow" = shows Growth + Care sections + Buy Now
  const [appVersion, setAppVersion] = useState("sow");
  
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

  // ===== DIBBY PROMO POPUP (once per week) =====
  const [showDibbyAd, setShowDibbyAd] = useState(false);
  const hasInitializedResults = useRef(false);

useEffect(() => {
  if (!isBrowser) return;

  const STORAGE_KEY = "dibbyAdLastDismissedAt";
  const WEEK_MS = 24 * 60 * 60 * 1000; // once per day

  try {
    const last = Number(window.localStorage.getItem(STORAGE_KEY) || 0);
    const now = Date.now();

    if (!last || now - last > WEEK_MS) {
      setShowDibbyAd(true);
    }
  } catch {}
}, []);

  // Get crop data
  const { cropData, loading: cropDataLoading, error: cropDataError, lastUpdated } = useCropData();

  const runFilter = useCallback(({
    cropNameValue = cropName,
    zoneValue = zone,
    categoryValue = category,
    sunRequirementValue = sunRequirement,
    waterNeedValue = waterNeed,
    soilPreferenceValue = soilPreference,
    modeValue = appVersion
  } = {}) => {
    if (!cropData) return [];

    const cropArray = Object.entries(cropData).map(([name, data]) => ({
      name,
      ...data,
      _raw: data
    }));

    const matches = filterCrops(cropArray, {
      cropName: cropNameValue,
      zone: zoneValue,
      category: categoryValue,
      sunRequirement: sunRequirementValue,
      waterNeed: waterNeedValue,
      soilPreference: soilPreferenceValue,
      mode: modeValue
    });

    setFilteredCrops(matches.map((crop) => [crop.name, crop._raw || crop]));
    setSowingCalendar(buildSowingCalendar(matches));
    setExpandedGroups({ flower: false, vegetable: false, herb: false, bulb: false });
    return matches;
  }, [
    appVersion,
    category,
    cropData,
    cropName,
    setSowingCalendar,
    soilPreference,
    sunRequirement,
    waterNeed,
    zone
  ]);

// Auto-populate results when crop data loads for the first time
useEffect(() => {
  if (cropData && !hasInitializedResults.current) {
    hasInitializedResults.current = true;
    runFilter({
      cropNameValue: "",
      zoneValue: "",
      categoryValue: "all",
      sunRequirementValue: "all",
      waterNeedValue: "all",
      soilPreferenceValue: "all",
      modeValue: appVersion
    });
  }
}, [cropData, runFilter]); // Only populate once when crop data arrives
  
  // ===== HANDLERS =====
  const handleSearch = () => {
    if (!cropData) return;
    setLoading(true);
    const searchValues = {
      cropNameValue: cropName,
      zoneValue: zone,
      categoryValue: category,
      sunRequirementValue: sunRequirement,
      waterNeedValue: waterNeed,
      soilPreferenceValue: soilPreference,
      modeValue: appVersion
    };

    setTimeout(() => {
      runFilter(searchValues);
      setLoading(false);
    }, 150);
  };

  const clearFilters = () => {
    setCropName("");
    setZone("");
    setCategory("all");
    setFrostDate("");
    setSunRequirement("all");
    setWaterNeed("all");
    setSoilPreference("all");
    setShowAdvancedFilters(false);
    if (cropData) {
      setLoading(true);
      window.setTimeout(() => {
        runFilter({
          cropNameValue: "",
          zoneValue: "",
          categoryValue: "all",
          sunRequirementValue: "all",
          waterNeedValue: "all",
          soilPreferenceValue: "all",
          modeValue: appVersion
        });
        setLoading(false);
      }, 150);
    }
  };

// Re-run search whenever the user switches Sow/Grow mode.
// deps intentionally limited to [appVersion]: handleSearch closes over latest state
// values at call-time; cropData is guarded inside; adding either would cause spurious runs.
const isModeFirstRender = useRef(true);
useEffect(() => {
  if (isModeFirstRender.current) {
    isModeFirstRender.current = false;
    return;
  }
  if (cropData) {
    handleSearch();
  }
}, [appVersion]);

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
          <div style={{ color: "#5f7b6d", textAlign: "center", marginTop: "1.2rem", fontWeight: 700 }}>
            Loading plant cards...
          </div>
          <LoadingCards />
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

 {showDibbyAd && (
  <div
    className="gp-modal-overlay"
    role="dialog"
    aria-modal="true"
    aria-label="Dibby promotion"
    onClick={() => {
      try {
        window.localStorage.setItem("dibbyAdLastDismissedAt", String(Date.now()));
      } catch {}
      setShowDibbyAd(false);
    }}
  >
    <div className="gp-modal" onClick={(e) => e.stopPropagation()}>
      <button
        className="gp-modal-close"
        type="button"
        aria-label="Close"
        onClick={() => {
          try {
            window.localStorage.setItem("dibbyAdLastDismissedAt", String(Date.now()));
          } catch {}
          setShowDibbyAd(false);
        }}
      >
        ✕
      </button>

      {/* Put your Dibby promo content here */}
<div className="gp-dibby-banner" style={{ marginBottom: 0 }}>
  <img
    src={dibbyYellow}
    alt="The Dibby seed planting tool"
    className="gp-dibby-banner-image"
  />

  <div className="gp-dibby-banner-content">
    <h2 className="gp-dibby-banner-title">
      🌱 Get Perfect Planting Depths with The Dibby!
    </h2>
    <p className="gp-dibby-banner-subtitle">
      Little Dibby & Dibby XL • 6 Colors Available
    </p>
  </div>

  <a
    href="https://amzn.to/4apJtyN"
    target="_blank"
    rel="noopener noreferrer"
    className="gp-dibby-banner-btn"
    onClick={() => {
      // optional: treat a click as “done for the week” too
      try {
        window.localStorage.setItem("dibbyAdLastDismissedAt", String(Date.now()));
      } catch {}
      setShowDibbyAd(false);
    }}
  >
    Shop on Amazon →
  </a>
</div>
    </div>
  </div>
)}

        <div className="gp-flex-center" style={{ flexDirection: "column", alignItems: "center" }}>

          {/* ===== SOW / GROW MODE SELECTOR — OUTSIDE & ABOVE THE CARD ===== */}
        <div className="gp-mode-panel">
          <div className="gp-mode-selector">
            <h1>
              🌱 Starting Seeds or Caring for Plants?
              <br />
              <span className="gp-mode-selector-subtitle">
                Search by plant name or category below!
              </span>
              {/* Version badge */}
              <span className={`gp-version-badge ${appVersion === "sow" ? "gp-version-lite" : "gp-version-full"}`}>
                {appVersion === "sow" ? "Sow" : "Grow"}
              </span>
            </h1>

            {/* Mode toggle buttons */}
            <div className="gp-mode-btn-row">
              <button
                type="button"
                className={`gp-mode-btn ${appVersion === "sow" ? "gp-mode-btn-active" : "gp-mode-btn-inactive"}`}
                onClick={() => setAppVersion("sow")}
                aria-pressed={appVersion === "sow"}
              >
                <span className="gp-mode-btn-title">Sow Mode</span>
                <span className="gp-mode-btn-copy">Seed-starting windows, depth, and spacing</span>
              </button>
              <span style={{ display: "none" }}>or</span>
              <button
                type="button"
                className={`gp-mode-btn ${appVersion === "grow" ? "gp-mode-btn-active" : "gp-mode-btn-inactive"}`}
                onClick={() => setAppVersion("grow")}
                aria-pressed={appVersion === "grow"}
              >
                <span className="gp-mode-btn-title">Grow Mode</span>
                <span className="gp-mode-btn-copy">Growth, harvest, and care details</span>
              </button>
            </div>
          </div>
        </div>

          <form
            className="gp-form-col"
            role="region"
            aria-label="Garden Planner search form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
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
                            {/* ===== PASS VERSION PROP TO CROPCARD ===== */}
                            <CropCard
                              cropName={cName}
                              cropData={cData}
                              version={appVersion}
                              lastUpdated={lastUpdated}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null
              )}
            </div>

            {filteredCrops.length === 0 && (
              <div className="gp-empty" role="status">
                <h3>No plants matched those filters</h3>
                <p>
                  Try switching between Sow and Grow mode, clearing one filter, or using a broader plant name.
                </p>
                <div className="gp-empty-actions">
                  <button type="button" className="gp-empty-btn" onClick={clearFilters}>
                    Clear filters
                  </button>
                  <button
                    type="button"
                    className="gp-empty-btn"
                    onClick={() => setShowAdvancedFilters((prev) => !prev)}
                  >
                    {showAdvancedFilters ? "Hide advanced filters" : "Adjust advanced filters"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {loading && (
          <>
            <div style={{ color: "#5f7b6d", textAlign: "center", marginTop: "1.2rem", fontWeight: 700 }}>
              Refreshing your plant matches...
            </div>
            <LoadingCards />
          </>
        )}
      </div>
    );
  }

  return null;
}