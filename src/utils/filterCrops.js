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

  return crops.filter(crop => {
    // Category filtering (flowers, herbs, vegetables)
    if (
      category &&
      category !== "all" &&
      getValue(crop.Basics, "Type").toLowerCase() !== category
    ) {
      return false;
    }

    // Zone filtering
    if (
      zone &&
      getValue(crop.Basics, "Grow Zone") &&
      !getValue(crop.Basics, "Grow Zone")
        .split(",")
        .map(z => z.trim())
        .includes(zone)
    ) {
      return false;
    }

    // Sun filtering
    if (
      sunRequirement &&
      sunRequirement !== "all" &&
      getValue(crop.Care, "Sun") &&
      !getValue(crop.Care, "Sun").toLowerCase().includes(sunRequirement)
    ) {
      return false;
    }

    // Water filtering
    if (
      waterNeed &&
      waterNeed !== "all" &&
      getValue(crop.Care, "Water") &&
      !getValue(crop.Care, "Water").toLowerCase().includes(waterNeed)
    ) {
      return false;
    }

    // Soil filtering
    if (
      soilPreference &&
      soilPreference !== "all" &&
      getValue(crop.Care, "Soil") &&
      !getValue(crop.Care, "Soil").toLowerCase().includes(soilPreference)
    ) {
      return false;
    }

    return true;
  });
}
