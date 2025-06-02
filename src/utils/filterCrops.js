// filterCrops.js

export function filterCrops(crops, filters) {
  const {
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

  return crops.filter(crop => {
    // CATEGORY filtering (flowers, herbs, vegetables): case-insensitive
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
    const growZoneVal = getValue(crop.Basics, "Grow Zone");
    if (
      zone &&
      (!isValidValue(growZoneVal) ||
        !growZoneVal
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
