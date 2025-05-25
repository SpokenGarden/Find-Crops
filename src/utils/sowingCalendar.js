// Utilities for calculating crop sowing calendar

// Parse sowing window strings like "4 to 6 before" or "1 to 2 after"
export function parseSowingRange(sowString) {
  if (!sowString) return null;
  const match = sowString.match(/(\d+)\s*to\s*(\d+)\s*(before|after)/);
  if (!match) return null;
  const [, start, end, when] = match;
  return {
    start: parseInt(start, 10),
    end: parseInt(end, 10),
    when, // 'before' or 'after'
  };
}

// Build a weekly calendar list for the UI
export function buildSowingCalendar(filteredCrops, frostDate) {
  if (!frostDate) return [];
  const frost = new Date(frostDate);
  // Use a range from 10 weeks before to 6 weeks after the frost date
  const weeks = [...Array(17).keys()].map(i => {
    const week = i - 10; // -10 to +6
    const weekStart = new Date(frost);
    weekStart.setDate(frost.getDate() + week * 7);
    return {
      week,
      weekStart,
      indoors: [],
      outdoors: [],
    };
  });

  filteredCrops.forEach(crop => {
    // Indoors
    const sowIndoors = parseSowingRange(crop.Sow_Indoors);
    if (sowIndoors) {
      const dir = sowIndoors.when === "before" ? -1 : 1;
      for (let w = sowIndoors.start; w <= sowIndoors.end; w++) {
        const idx = 10 + dir * w;
        if (weeks[idx] && !weeks[idx].indoors.includes(crop.Crop)) {
          weeks[idx].indoors.push(crop.Crop);
        }
      }
    }
    // Outdoors
    const sowOutdoors = parseSowingRange(crop.Sow_Outdoors);
    if (sowOutdoors) {
      const dir = sowOutdoors.when === "before" ? -1 : 1;
      for (let w = sowOutdoors.start; w <= sowOutdoors.end; w++) {
        const idx = 10 + dir * w;
        if (weeks[idx] && !weeks[idx].outdoors.includes(crop.Crop)) {
          weeks[idx].outdoors.push(crop.Crop);
        }
      }
    }
  });

  // Only return weeks in which something is to be sown
  return weeks.filter(w => w.indoors.length > 0 || w.outdoors.length > 0);
}