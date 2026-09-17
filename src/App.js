import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { filterCrops } from "./utils/filterCrops";
import { buildSowingCalendar } from "./utils/sowingCalendar";
import CropCard from "./components/CropCard";
import ToolsAndSupplies from "./components/ToolsAndSupplies";
import PlantingVideos from "./components/PlantingVideos";
import TopPlantBanner from "./components/TopPlantBanner";
import { useCropData } from "./hooks/useCropData";
import dibbyYellow from "./images/dibby-yellow.jpg";
import AuthModal from "./components/AuthModal";
import FavoritesList from "./components/FavoritesList";
import { useAuth } from "./context/AuthContext";
import { useFavorites } from "./hooks/useFavorites";
import { useOutsideClick } from "./hooks/useOutsideClick";

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
  .gp-container { max-width: 1100px; margin: 0 auto; padding: 1.2rem; font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #20392f; }
  .gp-app-shell { display: grid; gap: 1rem; }
  .gp-hero-shell {
    width: 100%;
    max-width: 860px;
    margin: 0 auto;
    border: 1px solid #d6eadf;
    border-radius: 22px;
    padding: 1.1rem 1rem;
    background: linear-gradient(180deg, #f5fbf8 0%, #eef7f2 100%);
    box-shadow: 0 16px 36px rgba(22, 48, 37, 0.08);
  }
  .gp-hero-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.9rem; }
  .gp-hero-title { margin: 0; font-size: 1.55rem; line-height: 1.2; color: #1f4d3b; font-weight: 800; letter-spacing: -0.01em; }
  .gp-hero-subtitle { margin: 0.5rem 0 0; color: #355e4d; font-size: 0.96rem; line-height: 1.5; max-width: 600px; }
  .gp-quick-nav { display: inline-flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.8rem; }
  .gp-chip-btn {
    border: 1px solid #bad8ca;
    background: #ffffff;
    color: #265845;
    border-radius: 999px;
    padding: 0.4rem 0.8rem;
    font-size: 0.84rem;
    font-weight: 700;
    cursor: pointer;
  }
  .gp-chip-btn:hover, .gp-chip-btn:focus-visible { background: #eaf5ef; border-color: #2d6a4f; outline: none; }
  .gp-back-btn { background: transparent; border: none; color: #2d6a4f; font-weight: 700; margin-bottom: 0.8rem; cursor: pointer; }
  .gp-flex-center { display: flex; justify-content: center; }
  .gp-form-col { width: 100%; max-width: 100%; background: #ffffff; border-radius: 16px; padding: 0.95rem 1rem; box-shadow: 0 6px 18px rgba(17,24,39,0.06); margin: 0 auto; border: 1px solid #deeee5; }
  .gp-label { display: block; margin-bottom: 0.6rem; color: #2d6a4f; font-weight: 600; font-size: 0.95rem; }
  .gp-input, .gp-select { width: 100%; padding: 0.45rem 0.6rem; border-radius: 8px; border: 1px solid #e6e6e6; font-size: 0.95rem; margin-top: 0.25rem; box-sizing: border-box; }
  .gp-find-btn { margin-top: 0.9rem; width: 100%; padding: 0.6rem; background: #2d6a4f; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 0.98rem; }
  .gp-results-grid { display: grid; gap: 0.9rem; margin-top: 1rem; }
  .gp-toggle-advanced { margin: 0.5rem 0; }
  /* ===== ACCOUNT TRIGGER ===== */
  .gp-account-trigger {
    background: rgba(255,255,255,0.85);
    border: 1px solid rgba(45,106,79,0.3);
    border-radius: 10px;
    padding: 0.38rem 0.7rem;
    color: #2d6a4f;
    font-weight: 700;
    font-size: 0.87rem;
    cursor: pointer;
    white-space: nowrap;
    position: relative;
  }
  .gp-account-trigger:hover { background: #eef7f0; }
  .gp-account-menu {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    background: #ffffff;
    border: 1px solid #dbeeda;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(17,24,39,0.12);
    overflow: hidden;
    min-width: 160px;
    z-index: 8000;
  }
  .gp-account-menu-item {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 0.6rem 0.9rem;
    font-size: 0.92rem;
    font-weight: 600;
    color: #2d6a4f;
    cursor: pointer;
  }
  .gp-account-menu-item:hover { background: #eef7f0; }
  .gp-account-menu-divider { height: 1px; background: #e5f0ea; margin: 0.15rem 0; }
  /* ===== FAVORITES ACTIONS ROW (below Find Plants, above results) ===== */
  .gp-fav-actions-row {
    display: flex;
    justify-content: center;
    margin: 0.75rem auto 0.25rem auto;
    max-width: 360px;
  }
  /* ===== FAVORITES BUTTON ===== */
  .gp-fav-btn-wrap { position: relative; display: inline-flex; flex-direction: column; align-items: flex-start; }
  .gp-fav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.45rem 0.8rem;
    background: #fff0f2;
    border: 1px solid #e07070;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 700;
    color: #a0272a;
    font-size: 0.95rem;
    white-space: nowrap;
  }
  .gp-fav-btn:hover, .gp-fav-btn:focus { background: #ffe5e8; border-color: #c0392b; outline: none; }
  .gp-fav-btn:focus-visible { outline: 3px solid rgba(192,57,43,0.25); }
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
.gp-results-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .gp-loading-card-top {
    flex-direction: column;
  }
  .gp-loading-media {
    width: 100%;
    max-width: 240px;
    flex-basis: auto;
    align-self: center;
  }
  .gp-hero-head {
    flex-direction: column;
  }
  .gp-hero-title {
    font-size: 1.35rem;
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

// ===== MAIN COMPONENT =====
export default function GardenPlannerApp() {
  // UI state
  const [screen, setScreen] = useState("search");
  const [dropdown1Open, setDropdown1Open] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===== AUTH / FAVORITES STATE =====
  const { user, signOut } = useAuth();
  const { count: favCount } = useFavorites();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const accountMenuRef = useRef(null);
  const favPanelRef = useRef(null);

  useOutsideClick(accountMenuRef, () => setShowAccountMenu(false), showAccountMenu);
  useOutsideClick(favPanelRef, () => setShowFavorites(false), showFavorites);

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

  useEffect(() => {
    if (category === "bulb") {
      setCategory("all");
    }
  }, [category, setCategory]);

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
    soilPreferenceValue = soilPreference
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
      soilPreference: soilPreferenceValue
    });

    const nonBulbMatches = matches.filter((crop) => getCropType(crop._raw || crop) !== "bulb");

    setFilteredCrops(nonBulbMatches.map((crop) => [crop.name, crop._raw || crop]));
    setSowingCalendar(buildSowingCalendar(nonBulbMatches));
    return nonBulbMatches;
  }, [
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
      soilPreferenceValue: "all"
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
      soilPreferenceValue: soilPreference
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
          soilPreferenceValue: "all"
        });
        setLoading(false);
      }, 150);
    }
  };

  // ===== COMPUTED VALUES =====
  const sortedFilteredCrops = useMemo(
    () => [...filteredCrops].sort((a, b) => a[0].localeCompare(b[0])),
    [filteredCrops]
  );
  const totalCount = filteredCrops.length;
  const flowerCount = filteredCrops.filter(([, cData]) => getCropType(cData) === "flower").length;
  const vegetableCount = filteredCrops.filter(([, cData]) => getCropType(cData) === "vegetable").length;
  const herbCount = filteredCrops.filter(([, cData]) => getCropType(cData) === "herb").length;

  const featuredBannerCrops = useMemo(() => {
    if (!cropData) return [];
    const preferredNames = [
      "Sunflower",
      "Zinnia",
      "Basil",
      "Lavender",
      "Marigold",
      "Tomato",
      "Pepper",
      "Lettuce",
      "Cucumber",
      "Dill"
    ];
    const nonBulbEntries = Object.entries(cropData)
      .filter(([, data]) => getCropType(data) !== "bulb")
      .map(([name, data]) => ({ name, data }));
    const normalizedMap = new Map(nonBulbEntries.map((entry) => [entry.name.toLowerCase(), entry]));
    const prioritized = preferredNames
      .map((name) => normalizedMap.get(name.toLowerCase()))
      .filter(Boolean);
    const remaining = nonBulbEntries.filter(
      (entry) => !preferredNames.some((name) => name.toLowerCase() === entry.name.toLowerCase())
    );
    return [...prioritized, ...remaining].slice(0, 10);
  }, [cropData]);

  const handleBannerSearch = useCallback((selectedCropName) => {
    setCropName(selectedCropName);
    setZone("");
    setCategory("all");
    setSunRequirement("all");
    setWaterNeed("all");
    setSoilPreference("all");
    setShowAdvancedFilters(false);
    setLoading(true);
    window.setTimeout(() => {
      runFilter({
        cropNameValue: selectedCropName,
        zoneValue: "",
        categoryValue: "all",
        sunRequirementValue: "all",
        waterNeedValue: "all",
        soilPreferenceValue: "all"
      });
      setLoading(false);
    }, 150);
  }, [runFilter, setCategory, setSoilPreference, setSunRequirement, setWaterNeed, setZone]);

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
                    Get the right seed sowing depth and much more for flowers, vegetables, and herbs.
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

        <div className="gp-app-shell">
          <div className="gp-hero-shell">
            <div className="gp-hero-head">
              <div>
                <h1 className="gp-hero-title">🌱 Find-Crops Plant Finder</h1>
                <p className="gp-hero-subtitle">
                  Search flowers, vegetables, and herbs in one streamlined mode. Use featured plant thumbnails or refine with advanced filters.
                </p>
                <div className="gp-quick-nav">
                  <button type="button" className="gp-chip-btn" onClick={() => setScreen("tools")}>
                    Tools & Supplies
                  </button>
                  <button type="button" className="gp-chip-btn" onClick={() => setScreen("videos")}>
                    Planting Videos
                  </button>
                </div>
              </div>
              <div ref={accountMenuRef} style={{ position: "relative" }}>
                {user ? (
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      className="gp-account-trigger"
                      aria-expanded={showAccountMenu}
                      onClick={() => setShowAccountMenu((v) => !v)}
                    >
                      My Account ▾
                    </button>
                    {showAccountMenu && (
                      <div className="gp-account-menu" role="menu">
                        <button
                          type="button"
                          className="gp-account-menu-item"
                          role="menuitem"
                          onClick={() => { setShowFavorites(true); setShowAccountMenu(false); }}
                        >
                          ❤️ Favorites ({favCount})
                        </button>
                        <div className="gp-account-menu-divider" />
                        <button
                          type="button"
                          className="gp-account-menu-item"
                          role="menuitem"
                          onClick={() => { signOut(); setShowAccountMenu(false); }}
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="gp-account-trigger"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Sign in
                  </button>
                )}
              </div>
            </div>

            <TopPlantBanner
              crops={featuredBannerCrops}
              activeCropName={cropName}
              onSearchCrop={handleBannerSearch}
            />

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
        </div>

        {/* ===== FAVORITES ACTIONS ROW — below Find Plants, above results ===== */}
        <div className="gp-fav-actions-row">
          <div className="gp-fav-btn-wrap" ref={favPanelRef}>
            <button
              type="button"
              className="gp-fav-btn"
              aria-expanded={showFavorites ? "true" : "false"}
              aria-controls="gp-favorites-panel"
              onClick={() => {
                if (!user) {
                  setShowAuthModal(true);
                } else {
                  setShowFavorites((v) => !v);
                }
              }}
            >
              <span>❤️ Favorites ({favCount})</span>
              <span style={{ fontSize: "1.05em" }}>{showFavorites ? "▲" : "▼"}</span>
            </button>
            {showFavorites && (
              <div id="gp-favorites-panel">
                <FavoritesList
                  onClose={() => setShowFavorites(false)}
                  onNeedsAuth={() => { setShowFavorites(false); setShowAuthModal(true); }}
                />
              </div>
            )}
          </div>
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
                  Herbs: {herbCount}
                </div>
              </div>
            )}

            {sortedFilteredCrops.length > 0 && (
              <div className="gp-results-grid" aria-live="polite">
                {sortedFilteredCrops.map(([cName, cData]) => (
                  <CropCard
                    key={cName}
                    cropName={cName}
                    cropData={cData}
                    lastUpdated={lastUpdated}
                    onNeedsAuth={() => setShowAuthModal(true)}
                  />
                ))}
              </div>
            )}

            {filteredCrops.length === 0 && (
              <div className="gp-empty" role="status">
                <h3>No plants matched those filters</h3>
                <p>
                  Try clearing one filter, searching by a broader plant name, or selecting a featured plant above.
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

        {/* ===== AUTH MODAL ===== */}
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    );
  }

  return null;
}