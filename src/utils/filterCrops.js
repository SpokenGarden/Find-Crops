// filterCrops.js

export function filterCrops(crops, filters) {
  const {
    cropName,
    mode,         // "sow" | "grow" – gates results by Sowing vs Care data
    zone,
    category,
    sunRequirement,
    waterNeed,
    soilPreference,
  } = filters;

  // Helper: get value from a section by label (case-insensitive)
  function getValue(section, label) {
    if (!Array.isArray(section)) return "";
    const found = section.find(
      item =>
        item.label &&
        item.label.toLowerCase().trim() === label.toLowerCase().trim()
    );
    return found ? (found.value || "") : "";
  }

  // Helper: check if a value is valid (not NA, not empty)
  function isValidValue(val) {
    return val && val.trim().toLowerCase() !== "na";
  }

  // Helper: returns true if the section array has at least one meaningful (non-NA) value
  function hasMeaningfulData(section) {
    if (!Array.isArray(section) || section.length === 0) return false;
    return section.some(item => isValidValue(item.value || ""));
  }

  return crops.filter(crop => {
    // MODE GATING: applied first so it always restricts results, even for cropName searches.
    // Sow mode: crop must have meaningful Sowing info.
    // Grow mode: crop must have meaningful Care info.
    if (mode === "sow" && !hasMeaningfulData(crop.Sowing)) return false;
    if (mode === "grow" && !hasMeaningfulData(crop.Care)) return false;

    // CROP NAME/KEYWORD SEARCH: if provided, match by name only (mode gate already applied above)
    if (cropName && cropName.trim() !== "") {
      const cropDisplay =
        crop.displayName ||
        crop.name ||
        (Array.isArray(crop.Basics) && getValue(crop.Basics, "Name")) ||
        "";
      return cropDisplay.toLowerCase().includes(cropName.trim().toLowerCase());
    }

    // CATEGORY filtering (flowers, herbs, vegetables, bulbs): case-insensitive
    const typeVal = getValue(crop.Basics, "Type");
    if (
      category &&
      category !== "all" &&
      (!isValidValue(typeVal) ||
        typeVal.toLowerCase().trim() !== category.toLowerCase().trim())
    ) {
      return false;
    }

    // ZONE filtering: allow flexible matching (e.g. "7" matches "07", ignores whitespace)
    const hardyZonesVal = getValue(crop.Basics, "Hardy Zones");
    if (
      zone &&
      (!isValidValue(hardyZonesVal) ||
        !hardyZonesVal
          .split(",")
          .map(z => z.trim().toLowerCase().replace(/^0+/, "")) // remove leading zeros, trim/normalize
          .some(z => z === zone.trim().toLowerCase().replace(/^0+/, "")))
    ) {
      return false;
    }

    // SUN filtering: case-insensitive substring match
    const sunVal = getValue(crop.Care, "Sun");
    if (
      sunRequirement &&
      sunRequirement !== "all" &&
      (!isValidValue(sunVal) ||
        !sunVal.toLowerCase().includes(sunRequirement.toLowerCase()))
    ) {
      return false;
    }

    // WATER filtering: case-insensitive substring match
    const waterVal = getValue(crop.Care, "Water");
    if (
      waterNeed &&
      waterNeed !== "all" &&
      (!isValidValue(waterVal) ||
        !waterVal.toLowerCase().includes(waterNeed.toLowerCase()))
    ) {
      return false;
    }

    // SOIL filtering: case-insensitive substring match
    const soilVal = getValue(crop.Care, "Soil");
    if (
      soilPreference &&
      soilPreference !== "all" &&
      (!isValidValue(soilVal) ||
        !soilVal.toLowerCase().includes(soilPreference.toLowerCase()))
    ) {
      return false;
    }

    return true;
  });
}