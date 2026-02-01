import React, { useState, useEffect } from "react";
import { filterCrops } from "./utils/filterCrops";
import { buildSowingCalendar } from "./utils/sowingCalendar";
import CropCard from "./components/CropCard";
import ToolsAndSupplies from "./components/ToolsAndSupplies";
import PlantingVideos from "./components/PlantingVideos";
import BackHomeButton from "./components/BackHomeButton";
import { useCropData } from "./hooks/useCropData"; // use hook instead of importing JSON

// Local storage helpers
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

export default function GardenPlannerApp() {
  // UI state
  const [screen, setScreen] = useState("search");

  // Crop search state
  const [zone, setZone] = useState(getLocal("zone", ""));
  const [category, setCategory] = useState(getLocal("category", "all"));
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [frostDate, setFrostDate] = useState(getLocal("frostDate", ""));
  const [sunRequirement, setSunRequirement] = useState(getLocal("sunRequirement", "all"));
  const [waterNeed, setWaterNeed] = useState(getLocal("waterNeed", "all"));
  const [soilPreference, setSoilPreference] = useState(getLocal("soilPreference", "all"));
  const [loading, setLoading] = useState(false);
  const [sowingCalendar, setSowingCalendar] = useState(getLocal("sowingCalendar", []));
  const [cropName, setCropName] = useState("");

  // Accordion state for group expansion (start all collapsed)
  const [expandedGroups, setExpandedGroups] = useState({
    flower: false,
    vegetable: false,
    herb: false,
    bulb: false,
  });

  // Advanced filter toggle
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Dropdown button state
  const [dropdown1Open, setDropdown1Open] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);

  // Use the hook to get crop data
  const { cropData, loading: cropDataLoading, error: cropDataError } = useCropData();

  // Persist simple filter fields
  useEffect(() => { setLocal("zone", zone); }, [zone]);
  useEffect(() => { setLocal("category", category); }, [category]);
  useEffect(() => { setLocal("frostDate", frostDate); }, [frostDate]);
  useEffect(() => { setLocal("sunRequirement", sunRequirement); }, [sunRequirement]);
  useEffect(() => { setLocal("waterNeed", waterNeed); }, [waterNeed]);
  useEffect(() => { setLocal("soilPreference", soilPreference); }, [soilPreference]);
  useEffect(() => { setLocal("sowingCalendar", sowingCalendar); }, [sowingCalendar]);

  // --- Search handler ---
  const handleSearch = () => {
    if (!cropData) return;
    setLoading(true);

    // small debounce/emulate load
    setTimeout(() => {
      const cropArray = Object.entries(cropData).map(([name, data]) => ({
        name,
        ...data,
        _raw: data
      }));

      const matches = filterCrops(
        cropArray,
        { cropName, zone, category, sunRequirement, waterNeed, soilPreference }
      );

      // keep stored shape as [name, rawData] so components that expect a name can still fetch by name
      const filtered = matches.map((crop) => [crop.name, crop._raw || crop]);

      setFilteredCrops(filtered);
      setSowingCalendar(buildSowingCalendar(matches));
      setLoading(false);

      // save matches raw data to localStorage as well
      try {
        if (isBrowser) window.localStorage.setItem("sowingCalendar", JSON.stringify(matches));
      } catch {}

      // Reset group expansion to all collapsed on new search:
      setExpandedGroups({ flower: false, vegetable: false, herb: false, bulb: false });
    }, 150);
  };

  // Helper to get the type/category from the crop's data
  function getCropType(cData) {
    if (!cData) return "other";
    if (cData.Basics && Array.isArray(cData.Basics)) {
      const typeField = cData.Basics.find(f => f.label && typeof f.label === "string" && f.label.toLowerCase() === "type");
      if (typeField && typeField.value) {
        const val = (typeof typeField.value === "string" ? typeField.value : String(typeField.value)).toLowerCase();
        if (val.includes("flower")) return "flower";
        if (val.includes("vegetable") || val.includes("veggie")) return "vegetable";
        if (val.includes("herb")) return "herb";
        if (val.includes("bulb")) return "bulb";
        return val || "other";
      }
    }
    // fallback: inspect category field if present
    if (cData.category) {
      const val = String(cData.category).toLowerCase();
      if (val.includes("flower")) return "flower";
      if (val.includes("vegetable")) return "vegetable";
      if (val.includes("herb")) return "herb";
      if (val.includes("bulb")) return "bulb";
    }
    return "other";
  }

  // Group filtered crops by type
  const groupedCrops = { flower: [], vegetable: [], herb: [], bulb: [], other: [] };
  filteredCrops.forEach(([cName, cData]) => {
    const type = getCropType(cData);
    if (groupedCrops[type]) groupedCrops[type].push([cName, cData]);
    else groupedCrops.other.push([cName, cData]);
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

  const toggleDropdown1 = () => {
    setDropdown1Open((prev) => !prev);
  };

  const toggleDropdown2 = () => {
    setDropdown2Open((prev) => !prev);
  };

  // Basic CSS to restore look, with narrower form and grouped, centered accordions
  // NOTE: updated .gp-group-list max-width to 720px so crop cards return to previous width
  const responsiveStyles = `
    .gp-container { max-width: 980px; margin: 0 auto; padding: 1.2rem; font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
    .gp-back-btn { background: transparent; border: none; color: #2d6a4f; font-weight: 700; margin-bottom: 0.8rem; cursor: pointer; }
    .gp-flex-center { display: flex; justify-content: center; }
    /* Halved form width: was 720px, now 360px for inputs/button to appear half size */
    .gp-form-col { width: 100%; max-width: 360px; background: #ffffff; border-radius: 12px; padding: 0.9rem 1rem; box-shadow: 0 6px 18px rgba(17,24,39,0.06); margin: 0 auto; }
    .gp-label { display: block; margin-bottom: 0.6rem; color: #2d6a4f; font-weight: 600; font-size: 0.95rem; }
    .gp-input, .gp-select { width: 100%; padding: 0.45rem 0.6rem; border-radius: 8px; border: 1px solid #e6e6e6; font-size: 0.95rem; margin-top: 0.25rem; box-sizing: border-box; }
    /* Find button half-size relative to previous (fits the narrower form) */
    .gp-find-btn { margin-top: 0.9rem; width: 100%; padding: 0.6rem; background: #2d6a4f; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 0.98rem; }

    .gp-toggle-advanced { margin: 0.5rem 0; }

    /* Groups row: center and lay headers in-line with each other */
    .gp-groups-row {
      display: flex; justify-content: center;
      gap: 1rem; flex-wrap: wrap;
      align-items: flex-start;
      margin-top: 1rem; 
      margin-bottom: 1rem; 
    }

    /* Groups row: center and add gap to create distinction */
  .gp-dropdown-container {
    max-width: 720px;
    margin: 20rem;
    background-color="#f7f8"4;}    }`;
}