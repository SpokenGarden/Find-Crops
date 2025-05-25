export function filterCrops(crops, { zone, category, sunRequirement, waterNeed, soilPreference }) {
  return crops.filter((crop) => {
    const zoneMatch =
      crop.Grow_Zones &&
      (crop.Grow_Zones.split(",").map(z => z.trim()).includes(zone) ||
        crop.Grow_Zones.split("to").some(range => {
          const parts = range.split("to").map(z => parseInt(z.trim(), 10));
          if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parseInt(zone, 10))) {
            return parseInt(zone, 10) >= parts[0] && parseInt(zone, 10) <= parts[1];
          }
          return false;
        })
      );
    const categoryMatch = category === "all" || crop.Type === category;
    const sunMatch = sunRequirement === "all" || crop.Sun_Requirement === sunRequirement;
    const waterMatch = waterNeed === "all" || crop.Water_Need === waterNeed;
    const soilMatch = soilPreference === "all" || crop.Soil_Preference === soilPreference;
    return zoneMatch && categoryMatch && sunMatch && waterMatch && soilMatch;
  });
}