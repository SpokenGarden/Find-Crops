const GENERIC_VENDOR_HOSTS = new Set([
  "bit.ly",
  "buff.ly",
  "linktr.ee",
  "ow.ly",
  "t.co",
  "tinyurl.com",
]);

export function makeItemId(cropName) {
  return String(cropName || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function cleanString(value) {
  return isNonEmptyString(value) ? value.trim() : null;
}

function unslugifyItemId(itemId) {
  if (!isNonEmptyString(itemId)) return "Saved crop";
  return itemId
    .trim()
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getSectionFields(cropData, sectionName) {
  return Array.isArray(cropData?.[sectionName]) ? cropData[sectionName] : [];
}

function getFieldValue(fields, label) {
  const normalizedLabel = String(label || "").trim().toLowerCase();
  const match = fields.find(
    (field) =>
      typeof field?.label === "string" &&
      field.label.trim().toLowerCase() === normalizedLabel &&
      isNonEmptyString(field.value)
  );
  return match ? match.value.trim() : null;
}

function getBuyLink(cropData) {
  for (const key of ["Link", "Links"]) {
    const buyNowUrl = getFieldValue(getSectionFields(cropData, key), "Buy Now");
    if (buyNowUrl && /^https?:\/\//i.test(buyNowUrl)) {
      return buyNowUrl;
    }
  }
  return null;
}

function getImagePath(cropData) {
  return getFieldValue(getSectionFields(cropData, "Image"), "Photo");
}

function normalizeVendorHost(value) {
  if (!isNonEmptyString(value)) return null;
  const trimmedValue = value.trim();

  try {
    const hostname = new URL(trimmedValue).hostname.replace(/^www\./i, "").toLowerCase();
    return GENERIC_VENDOR_HOSTS.has(hostname) ? null : hostname;
  } catch {
    const hostname = trimmedValue.replace(/^www\./i, "").toLowerCase();
    return hostname && !GENERIC_VENDOR_HOSTS.has(hostname) ? hostname : null;
  }
}

export function extractItemType(cropData) {
  const itemType = getFieldValue(getSectionFields(cropData, "Basics"), "Type");
  return itemType ? itemType.toLowerCase() : null;
}

function buildFavoriteMeta(cropName, cropData) {
  const itemId = makeItemId(cropName);
  const basics = getSectionFields(cropData, "Basics");
  const care = getSectionFields(cropData, "Care");
  const harvest = getSectionFields(cropData, "Harvest");
  const buyNowUrl = getBuyLink(cropData);

  return {
    schemaVersion: 1,
    itemId,
    itemName: cleanString(cropName) || unslugifyItemId(itemId),
    itemType: extractItemType(cropData),
    kind: getFieldValue(basics, "Kind"),
    hardinessZones: getFieldValue(basics, "Hardiness Zones") || getFieldValue(basics, "Hardy Zones"),
    season: getFieldValue(basics, "Flower Season") || getFieldValue(harvest, "Harvest Season"),
    image: getImagePath(cropData),
    buyNowUrl,
    vendor: normalizeVendorHost(buyNowUrl),
    sun: getFieldValue(care, "Sun"),
    water: getFieldValue(care, "Water"),
    soil: getFieldValue(care, "Soil"),
  };
}

export function buildFavoritePayload(cropName, cropData) {
  const payload = cropData ? JSON.parse(JSON.stringify(cropData)) : {};
  return {
    ...payload,
    favoriteMeta: buildFavoriteMeta(cropName, cropData || {}),
  };
}

export function normalizeFavoriteRecord(row) {
  const rawPayload = row?.payload && typeof row.payload === "object" ? row.payload : {};
  const cropData =
    rawPayload?.cropData && typeof rawPayload.cropData === "object"
      ? rawPayload.cropData
      : rawPayload;
  const existingMeta =
    rawPayload?.favoriteMeta && typeof rawPayload.favoriteMeta === "object"
      ? rawPayload.favoriteMeta
      : {};
  const itemId =
    cleanString(row?.item_id) ||
    cleanString(existingMeta.itemId) ||
    makeItemId(row?.item_name || existingMeta.itemName || "");
  const itemName =
    cleanString(row?.item_name) ||
    cleanString(existingMeta.itemName) ||
    unslugifyItemId(itemId);
  const buyNowUrl = cleanString(existingMeta.buyNowUrl) || getBuyLink(cropData);
  const vendor =
    cleanString(row?.vendor) ||
    cleanString(existingMeta.vendor) ||
    normalizeVendorHost(buyNowUrl);
  const normalizedPayload = {
    ...cropData,
    favoriteMeta: {
      schemaVersion: existingMeta.schemaVersion || 1,
      itemId,
      itemName,
      itemType:
        cleanString(row?.item_type)?.toLowerCase() ||
        cleanString(existingMeta.itemType)?.toLowerCase() ||
        extractItemType(cropData),
      kind: cleanString(existingMeta.kind) || getFieldValue(getSectionFields(cropData, "Basics"), "Kind"),
      hardinessZones:
        cleanString(existingMeta.hardinessZones) ||
        getFieldValue(getSectionFields(cropData, "Basics"), "Hardiness Zones") ||
        getFieldValue(getSectionFields(cropData, "Basics"), "Hardy Zones"),
      season:
        cleanString(existingMeta.season) ||
        getFieldValue(getSectionFields(cropData, "Basics"), "Flower Season") ||
        getFieldValue(getSectionFields(cropData, "Harvest"), "Harvest Season"),
      image: cleanString(existingMeta.image) || getImagePath(cropData),
      buyNowUrl,
      vendor: normalizeVendorHost(vendor || buyNowUrl),
      sun: cleanString(existingMeta.sun) || getFieldValue(getSectionFields(cropData, "Care"), "Sun"),
      water: cleanString(existingMeta.water) || getFieldValue(getSectionFields(cropData, "Care"), "Water"),
      soil: cleanString(existingMeta.soil) || getFieldValue(getSectionFields(cropData, "Care"), "Soil"),
    },
  };

  return {
    item_id: itemId,
    item_name: itemName,
    item_type: normalizedPayload.favoriteMeta.itemType,
    vendor: normalizedPayload.favoriteMeta.vendor,
    payload: normalizedPayload,
    created_at: row?.created_at || null,
  };
}
