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
        console.log("Loaded crop data:", data);
        setCropData(data);
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
  const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const generateSowingCalendar = () => {
  const weekMap = {};
  const base = new Date(frostDate);
  
  filteredCrops.forEach((crop) => {
    [
      { type: 'Sow_Indoors', icon: '🏠' },
      { type: 'Sow_Outdoors', icon: '🌿' },
    ].forEach(({ type, icon }) => {
const sowText = crop[type] || crop[type.toLowerCase()] || crop[type.replace("_", " ")] || "";

      console.log(`Checking ${crop.Crop}: ${type} = ${sowText}`);

      if (!sowText) return;

      const match = sowText.match(/(\d+)\s*(?:to|-)?\s*(\d+)?\s*(before|after)/i);
      if (!match) return;

      const startWeeks = parseInt(match[1]);
      const endWeeks = parseInt(match[2] || match[1]);
      const direction = match[3].toLowerCase();

      const sowStart = new Date(base);
      const sowEnd = new Date(base);
      sowStart.setDate(base.getDate() + (direction === 'before' ? -1 : 1) * startWeeks * 7);
      sowEnd.setDate(base.getDate() + (direction === 'before' ? -1 : 1) * endWeeks * 7);

      const current = new Date(sowStart);
      while (current <= sowEnd) {
        const startOfWeek = new Date(current);
        startOfWeek.setDate(current.getDate() - current.getDay());
        const weekKey = startOfWeek.toISOString().split('T')[0];
        if (!weekMap[weekKey]) weekMap[weekKey] = [];

const label = `${icon} <strong>${crop.Crop}</strong> (${crop.Type}) - ${icon === "🏠" ? "Indoors" : "Outdoors"}`;
if (!weekMap[weekKey].some(item => item.includes(crop.Crop) && item.includes(icon))) {
  weekMap[weekKey].push(label);
}



        current.setDate(current.getDate() + 1);
      }
    });
  });

  const calendarWindow = window.open("", "_blank");
  if (calendarWindow) {
    calendarWindow.document.write("<html><head><title>Sowing Calendar</title><style>body { font-family:sans-serif; } .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; } .day-box { border: 1px solid #ccc; border-radius: 6px; padding: 0.5rem; min-height: 100px; } .date-label { font-weight: bold; font-size: 0.9rem; margin-bottom: 0.3rem; } .crop-entry { font-size: 0.8rem; margin: 0.2rem 0; } @media print { button { display: none; }}</style></head>");
    calendarWindow.document.write("<body>");
    calendarWindow.document.write("<h1>📅 Detailed Sowing Calendar</h1>");
    calendarWindow.document.write("<button onclick=\"window.print()\" style=\"margin-bottom: 1rem; padding: 0.5rem 1rem; font-size: 1rem;\">🖨️ Print Calendar</button>");

    const groupedByMonth = {};
    Object.keys(weekMap).sort().forEach(date => {
      const dt = new Date(date);
      const monthYear = `${months[dt.getMonth()]} ${dt.getFullYear()}`;
      if (!groupedByMonth[monthYear]) groupedByMonth[monthYear] = [];
      groupedByMonth[monthYear].push({ week: dt, entries: weekMap[date] });
    });

    Object.keys(groupedByMonth).forEach(month => {
      calendarWindow.document.write(`<h2>${month}</h2><div class='calendar-grid'>`);
      groupedByMonth[month].forEach(({ week, entries }) => {
        calendarWindow.document.write("<div class='day-box'>");
        calendarWindow.document.write(`<div class='date-label'>Week of ${week.toLocaleDateString()}</div>`);
        entries.forEach(entry => {
          calendarWindow.document.write(`<div class='crop-entry'>${entry}</div>`);
        });
        calendarWindow.document.write("</div>");
      });
      calendarWindow.document.write("</div>");
    });


    calendarWindow.document.write("</body></html>");
    calendarWindow.document.close();
  }
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
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#2d6a4f", textAlign: "center" }}>🌱 GrowBuddy Garden Planner</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label>
          Enter Your Grow Zone:
          <input
            type="text"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            style={{ width: "100%", padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
            placeholder="e.g., 7"
          />
        </label>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label>
          Average Last Frost Date:
          <input
            type="date"
            value={frostDate}
            onChange={(e) => setFrostDate(e.target.value)}
            style={{ width: "100%", padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </label>
        <button onClick={handleGetLocation} style={{ marginTop: "0.5rem", padding: "0.6rem", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }}>📍 Use My Location</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label>
          Select Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%", padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            <option value="all">All</option>
            <option value="flower">Flowers</option>
            <option value="herb">Herbs</option>
            <option value="vegetable">Vegetables</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label>
          Sun Requirement:
          <select
            value={sunRequirement}
            onChange={(e) => setSunRequirement(e.target.value)}
            style={{ width: "100%", padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            <option value="all">All</option>
            <option value="full sun">Full Sun</option>
            <option value="part shade">Part Shade</option>
            <option value="full shade">Full Shade</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label>
          Water Need:
          <select
            value={waterNeed}
            onChange={(e) => setWaterNeed(e.target.value)}
            style={{ width: "100%", padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label>
          Soil Preference:
          <select
            value={soilPreference}
            onChange={(e) => setSoilPreference(e.target.value)}
            style={{ width: "100%", padding: "0.6rem", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            <option value="all">All</option>
            <option value="loamy">Loamy</option>
            <option value="sandy">Sandy</option>
            <option value="clay">Clay</option>
            <option value="well-drained">Well-drained</option>
          </select>
        </label>
      </div>

<button
        onClick={handleSearch}
        style={{ padding: "0.75rem 1rem", backgroundColor: "#52b788", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", width: "100%" }}
      >
        Find Crops
      </button>

      {filteredCrops.length > 0 && (
        <button
          onClick={generateSowingCalendar}
          style={{ padding: "0.75rem 1rem", backgroundColor: "#40916c", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", width: "100%" }}
        >
          📅 View Sowing Calendar
        </button>
      )}

      {filteredCrops.length > 0 ? (
  <>
    <div style={{ marginTop: "2rem" }}>
      <p style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.75rem", textAlign: "center" }}>
        We found {filteredCrops.length} matching crops:
      </p>
      <h2 style={{ color: "#40916c", textAlign: "center", fontSize: "1.25rem", marginBottom: "1rem" }}>🌼 Recommended Crops</h2>
    </div>

    <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#e8f5e9", borderRadius: "8px" }}>
      <h3 style={{ color: "#2d6a4f", textAlign: "center" }}>🌟 What to Do Next</h3>
      <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "0.5rem" }}>
        <li><label><input type="checkbox" style={{ marginRight: "0.5rem" }} /> 🛒 Get your garden tools & supplies</label></li>
        <li><label><input type="checkbox" style={{ marginRight: "0.5rem" }} /> 📅 View or print your sowing calendar</label></li>
        <li><label><input type="checkbox" style={{ marginRight: "0.5rem" }} /> 🌱 Start sowing seeds indoors or outdoors</label></li>
        <li><label><input type="checkbox" style={{ marginRight: "0.5rem" }} /> 📷 Take notes or photos of your progress</label></li>
        <li><label><input type="checkbox" style={{ marginRight: "0.5rem" }} /> 🔔 Set reminders for transplanting or thinning</label></li>
      </ul>
    </div>

    <ul style={{ listStyleType: "none", padding: 0 }}>
  {filteredCrops.map((crop, index) => (
    <li
      key={crop.Crop + index}
      style={{
        background: "#ffffff",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "1rem",
        marginBottom: "1rem",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
      }}
    >
      <strong style={{ fontSize: "1.1rem" }}>{crop.Crop}</strong> <em>({crop.Type})</em><br />
      🌱 Sow Indoors: {parseSowWindow(crop.Sow_Indoors, frostDate)}<br />
      🌿 Sow Outdoors: {parseSowWindow(crop.Sow_Outdoors, frostDate)}<br />
      ⏱ Days to Germination: {crop.Days_to_Germination || "N/A"}<br />
      🍅 Days to Harvest: {crop.Days_to_Harvest || "N/A"}<br />
      📍 Grow Zones: {formatZones(crop.Grow_Zones || "")}
    </li>
  ))}
</ul>

  </>
) : (

  <div style={{ marginTop: "2rem", color: "#6c757d", fontStyle: "italic" }}>
    No crops matched your search criteria. Please try different filters.
  </div>
)}

{/* end of form container inside started block */}
</div>

    )}
{/* closes main app container */}
</div>

      );
}

