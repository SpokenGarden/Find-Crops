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
          Crop: item["Crop Common Names"]
        }));
        console.log("Loaded crop data:", normalized);
        setCropData(normalized);
      })
      .catch((err) => console.error("Failed to load crop data:", err));
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User Location:", latitude, longitude);

        try {
          const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_min&timezone=auto`);
          const data = await response.json();
          console.log("Weather data:", data);
        } catch (error) {
          console.error("Error fetching frost date:", error);
        }
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const parseSowWindow = (text, baseDate) => {
    if (!text || !baseDate) return "N/A";
    const match = text.match(/(\d+)\s*(?:to|-)?\s*(\d+)?\s*(before|after)/i);
    if (!match) return "N/A";

    const from = match[1];
    const to = match[2];
    const direction = match[3];
    const startWeeks = parseInt(from);
    const endWeeks = parseInt(to || from);
    const sign = direction.toLowerCase() === "before" ? -1 : 1;

    const firstDate = new Date(baseDate);
    const secondDate = new Date(baseDate);
    firstDate.setDate(firstDate.getDate() + sign * startWeeks * 7);
    secondDate.setDate(secondDate.getDate() + sign * endWeeks * 7);

    const sortedDates = [firstDate, secondDate].sort((a, b) => a - b);
    return `${sortedDates[0].toLocaleDateString()} - ${sortedDates[1].toLocaleDateString()}`;
  };

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

      return zoneMatch && categoryMatch;
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

  const formatZones = (zones) => {
    const numbers = zones.match(/\d+/g);
    return numbers ? numbers.join(", ") : zones;
  };

  const enhanceText = (text) => {
    return text.replace(/before/gi, "before your average last frost date");
  };

  return null;
}
