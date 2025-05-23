/* Fully functional GrowBuddy App with working search */
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
        const normalized = data.map(item => ({
          ...item,
          Crop: item["Crop Common Names"],
          Days_to_Germination: item["Days to Germination"],
          Days_to_Harvest: item["Days to Harvest or Maturity (after germination)"],
          Sow_Indoors: item["Sow Indoors (weeks before or after last spring frost)"],
          Sow_Outdoors: item["Sow Outdoors (weeks before or after last spring frost)"]
        }));
        console.log("Loaded crop data:", normalized);
        setCropData(normalized);
      })
      .catch((err) => console.error("Failed to load crop data:", err));
  }, []);

  const handleSearch = () => {
    const userZone = zone.trim();
    const results = (cropData || []).filter((crop) => {
      if (!crop || !crop.Grow_Zones || !crop.Type || !crop.Crop) return false;

      const zoneList = crop.Grow_Zones.replace(/[^\d\-\s,]/g, '')
        .split(/[\s,]+/)
        .flatMap(z => {
          if (z.includes('-')) {
            const [start, end] = z.split('-').map(Number);
            return Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString());
          }
          return z ? [z] : [];
        });

      const zoneMatch = userZone === "" || zoneList.includes(userZone);
      const categoryMatch = category === "all" || crop.Type.toLowerCase() === category.toLowerCase();
      const sunMatch = sunRequirement === "all" || (typeof crop["Sun Requirements"] === "string" && crop["Sun Requirements"].toLowerCase().includes(sunRequirement));
      const waterMatch = waterNeed === "all" || (typeof crop["Water Needs"] === "string" && crop["Water Needs"].toLowerCase().includes(waterNeed));
      const soilMatch = soilPreference === "all" || (typeof crop["Soil Preferences"] === "string" && crop["Soil Preferences"].toLowerCase().includes(soilPreference));

      return zoneMatch && categoryMatch && sunMatch && waterMatch && soilMatch;
    });

    const sorted = results.sort((a, b) => {
      const aDays = parseInt(a.Days_to_Germination);
      const bDays = parseInt(b.Days_to_Germination);
      if (isNaN(aDays)) return 1;
      if (isNaN(bDays)) return -1;
      return aDays - bDays;
    });

    setFilteredCrops(sorted);
  };

  // ... rest of the app remains unchanged
}
