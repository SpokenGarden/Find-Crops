// filterCrops.js

export function filterCrops(crops, filters) {
  const {
    zone,
    category,
    sunRequirement,
    waterNeed,
    soilPreference,
  } = filters;

  // Helper function to get value from a section by label
  function getValue(section, label) {
    if (!section) return "";
    const found = section.find(item => item.label && item.label.toLowerCase() === label.toLowerCase());
    return found ? (found.value || "") : "";
  }

  // Helper to check if a value is valid (not NA, not empty)
  function isValidValue(val) {
    return val && val.trim().toLowerCase() !== "na";
  }

  return crops.filter(crop => {
    // Category filtering (flowers, herbs, vegetables)
    const typeVal = getValue(crop.Basics, "Type");
    if (
      category &&
      category !== "all" &&
      (!isValidValue(typeVal) || typeVal.toLowerCase() !== category)
    ) {
      return false;
    }

    // Zone filtering
    const growZoneVal = getValue(crop.Basics, "Grow Zone");
    if (
      zone &&
      (!isValidValue(growZoneVal) ||
        !growZoneVal
          .split(",")
          .map(z => z.trim())
          .includes(zone))
    ) {
      return false;
    }

    // Sun filtering
    const sunVal = getValue(crop.Care, "Sun");
    if (
      sunRequirement &&
      sunRequirement !== "all" &&
      (!isValidValue(sunVal) || !sunVal.toLowerCase().includes(sunRequirement))
    ) {
      return false;
    }

    // Water filtering
    const waterVal = getValue(crop.Care, "Water");
    if (
      waterNeed &&
      waterNeed !== "all" &&
      (!isValidValue(waterVal) || !waterVal.toLowerCase().includes(waterNeed))
    ) {
      return false;
    }

    // Soil filtering
    const soilVal = getValue(crop.Care, "Soil");
    if (
      soilPreference &&
      soilPreference !== "all" &&
      (!isValidValue(soilVal) || !soilVal.toLowerCase().includes(soilPreference))
    ) {
      return false;
    }

    return true;
  });
}
