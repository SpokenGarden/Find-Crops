import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCropData } from "../hooks/useCropData";

const isBrowser = typeof window !== "undefined";
const FAVORITES_KEY = "favoriteCrops";
const CARD_STATE_KEY = "cropCardSecondaryState";
const IMAGE_BASE = `${process.env.PUBLIC_URL || ""}/images/flowers`;
const DEFAULT_IMAGE = `${IMAGE_BASE}/default-flower.png`;

const SECTION_ICONS = {
  Basics: "📘",
  Sowing: "🌱",
  Growing: "🌿",
  Growth: "🌿",
  Harvest: "🧺",
  Care: "💚",
};

function getStoredValue(key, fallback, storage = "localStorage") {
  if (!isBrowser) return fallback;
  try {
    const value = window[storage].getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function setStoredValue(key, value, storage = "localStorage") {
  if (!isBrowser) return;
  try {
    window[storage].setItem(key, JSON.stringify(value));
  } catch {}
}

function getIconForLabel(label) {
  const icons = {
    Type: "🪴",
    Sun: "☀️",
    Water: "💧",
    Soil: "🪨",
    "Hardy Zones": "🗺️",
    "Hardiness Zones": "🗺️",
    "Days to Harvest": "🗓️",
    "Days to Maturity or Harvest": "🗓️",
    "Days to Germination": "⏳",
    Spacing: "📏",
    Height: "📏",
    Depth: "🫳",
    Indoors: "🏡",
    Outdoors: "🌤️",
    Kind: "🌼",
    "Flower Season": "🌸",
    When: "🗓️",
  };
  return icons[label] || "🔹";
}

const LABEL_DISPLAY_MAP = {
  "Hardy Zones": "Hardiness Zones",
};

const BASICS_HIDDEN_LABELS = new Set(["Type"]);

function getCardId(cropName) {
  return `crop-card-${cropName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function formatLastUpdated(lastUpdated) {
  if (!lastUpdated) return "Recently";
  const date = new Date(lastUpdated);
  if (Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CropCardWithData({ cropName, version }) {
  const { cropData, loading, error, lastUpdated } = useCropData();

  if (loading) {
    return (
      <div
        className="crop-card"
        style={{ minHeight: 250, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        Loading crop data...
      </div>
    );
  }

  if (error) {
    return <div className="crop-card">Error loading crop data: {error.message}</div>;
  }

  return (
    <CropCardContent
      cropName={cropName}
      cropData={cropData?.[cropName]}
      version={version}
      lastUpdated={lastUpdated}
    />
  );
}

function CropCardContent({ cropName, cropData, version = "sow", lastUpdated }) {
  const cardId = useMemo(() => getCardId(cropName), [cropName]);
  const sessionKey = `${CARD_STATE_KEY}:${version}:${cropName}`;
  const [secondaryExpanded, setSecondaryExpanded] = useState(() =>
    getStoredValue(sessionKey, false, "sessionStorage")
  );
  const lastSessionKeyRef = useRef(sessionKey);
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = getStoredValue(FAVORITES_KEY, {});
    return Boolean(favorites[cropName]);
  });
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    if (lastSessionKeyRef.current !== sessionKey) {
      lastSessionKeyRef.current = sessionKey;
      setSecondaryExpanded(getStoredValue(sessionKey, false, "sessionStorage"));
      return;
    }
    setStoredValue(sessionKey, secondaryExpanded, "sessionStorage");
  }, [secondaryExpanded, sessionKey]);

  useEffect(() => {
    const favorites = getStoredValue(FAVORITES_KEY, {});
    setIsFavorite(Boolean(favorites[cropName]));
  }, [cropName]);

  useEffect(() => {
    if (!shareMessage) return undefined;
    const timer = window.setTimeout(() => setShareMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [shareMessage]);

  if (!cropData) {
    return <div className="crop-card">No data available for this crop.</div>;
  }

  const displayData = { ...cropData };
  let buyNowUrl = "";
  let plantImage = "";

  if (displayData.Image && Array.isArray(displayData.Image)) {
    const imageField = displayData.Image.find(
      (field) =>
        typeof field.label === "string" &&
        field.label.trim().toLowerCase() === "photo"
    );
    if (imageField && imageField.value) {
      plantImage = imageField.value.trim();
    }
    delete displayData.Image;
  }

  ["Link", "Links"].forEach((linkKey) => {
    if (displayData[linkKey]) {
      const linkFields = Array.isArray(displayData[linkKey]) ? displayData[linkKey] : [];
      const buyNowField = linkFields.find(
        (field) =>
          typeof field.label === "string" &&
          field.label.trim().toLowerCase() === "buy now" &&
          typeof field.value === "string" &&
          /^https?:\/\//i.test(field.value.trim())
      );
      if (buyNowField) buyNowUrl = buyNowField.value.trim();
      delete displayData[linkKey];
    }
  });

  const basicsFields = Array.isArray(displayData.Basics) ? displayData.Basics : [];
  const secondaryGroups =
    version === "grow"
      ? ["Growth", "Harvest", "Care"]
          .map((section) => ({ section, fields: displayData[section] }))
          .filter(({ fields }) => Array.isArray(fields) && fields.length > 0)
      : [{ section: "Sowing", fields: displayData.Sowing }].filter(
          ({ fields }) => Array.isArray(fields) && fields.length > 0
        );
  const secondaryLabel = version === "grow" ? "Growing" : "Sowing";
  const lastUpdatedLabel = formatLastUpdated(lastUpdated);

  const toggleFavorite = () => {
    const favorites = getStoredValue(FAVORITES_KEY, {});
    const nextFavorite = !favorites[cropName];
    const nextFavorites = { ...favorites };
    if (nextFavorite) {
      nextFavorites[cropName] = true;
    } else {
      delete nextFavorites[cropName];
    }
    setStoredValue(FAVORITES_KEY, nextFavorites);
    setIsFavorite(nextFavorite);
  };

  const handleShare = async () => {
    if (!isBrowser) return;
    const shareUrl = `${window.location.href.split("#")[0]}#${cardId}`;
    const shareData = {
      title: `${cropName} • Dibby Grow Buddy`,
      text: `Check out ${cropName} in ${version === "grow" ? "Grow" : "Sow"} mode.`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareMessage("Shared");
        return;
      } catch (error) {
        if (error && error.name === "AbortError") {
          setShareMessage("");
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage("Link copied");
    } catch {
      setShareMessage("Copy not available");
    }
  };

  const styleCropName = (name) => {
    const match = name.match(/^(.+?)\s\((.+?)\)$/);
    if (!match) return name;
    const mainName = match[1];
    const italicText = match[2];
    return (
      <>
        {mainName} <span style={{ fontStyle: "italic" }}>({italicText})</span>
      </>
    );
  };

  const renderFieldList = (fields, hiddenLabels = null) => (
    <ul className="crop-card-field-list">
      {fields
        .filter(({ label }) => !hiddenLabels || !hiddenLabels.has(label))
        .map(({ label, value }, idx) => {
          const displayLabel = LABEL_DISPLAY_MAP[label] || label;
          return (
            <li key={`${label}-${value}-${idx}`} className="crop-card-field-item">
              <span className="crop-card-field-icon" aria-hidden="true">
                {getIconForLabel(displayLabel)}
              </span>
              <span className="crop-card-field-copy">
                <span className="crop-card-field-label">{displayLabel}</span>
                <span className="crop-card-field-value">{value}</span>
              </span>
            </li>
          );
        })}
    </ul>
  );

  const renderSectionHeader = (label, buttonProps = {}) => (
    <div className="crop-card-section-header">
      <div className="crop-card-section-title">
        <span aria-hidden="true">{SECTION_ICONS[label] || "🌿"}</span>
        <span>{label}</span>
      </div>
      {buttonProps.onClick && (
        <button type="button" className="crop-card-toggle-btn" {...buttonProps} />
      )}
    </div>
  );

  return (
    <div className="crop-card" id={cardId}>
      <style>{`
        .crop-card {
          background: linear-gradient(135deg, #f3fcf7 0%, #e6f9ee 100%);
          border-radius: 22px;
          box-shadow: 0 4px 16px rgba(34,74,66,0.08);
          border: 1px solid #d0ede1;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
          position: relative;
          max-width: 700px;
          width: 100%;
          min-width: 0;
          margin: 0 auto 0.8rem auto;
          box-sizing: border-box;
        }
        .crop-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .crop-card-heading {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          min-width: 0;
          flex: 1;
        }
        .crop-card-title-wrap {
          min-width: 0;
        }
        .crop-card-title {
          color: #155943;
          font-weight: 800;
          font-size: 1.2rem;
          line-height: 1.2;
          letter-spacing: 0.01em;
          display: block;
        }
        .crop-card-subtitle {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.35rem;
          color: #3d6656;
          font-size: 0.84rem;
          font-weight: 700;
        }
        .crop-card-mode-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: ${version === "grow" ? "#e2f2e6" : "#fff5dc"};
          color: #245a45;
          border: 1px solid ${version === "grow" ? "#b8dec3" : "#efd7a5"};
          border-radius: 999px;
          padding: 0.26rem 0.62rem;
        }
        .crop-card-actions {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .crop-card-action-btn {
          border: 1px solid #b9dcca;
          background: #ffffff;
          color: #1f5c44;
          border-radius: 999px;
          padding: 0.45rem 0.75rem;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
        }
        .crop-card-action-btn:hover,
        .crop-card-action-btn:focus-visible,
        .crop-card-toggle-btn:hover,
        .crop-card-toggle-btn:focus-visible {
          background: #edf8f1;
          border-color: #2d6a4f;
          outline: 2px solid #2d6a4f;
          outline-offset: 2px;
        }
        .crop-card-action-btn:active,
        .crop-card-toggle-btn:active {
          transform: translateY(1px);
        }
        .crop-card-action-btn.is-favorite {
          background: #fff4da;
          border-color: #efc86f;
        }
        .crop-card-share-note {
          color: #456858;
          font-size: 0.75rem;
          font-weight: 600;
          min-height: 1rem;
        }
        .crop-card-top {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .crop-card-media {
          width: 182px;
          flex: 0 0 182px;
          aspect-ratio: 1 / 1;
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(180deg, #edf5ef 0%, #d8eadf 100%);
          border: 1px solid #d0ede1;
          box-shadow: 0 2px 10px rgba(34,74,66,0.1);
        }
        .crop-card-plant-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          background: #fff;
        }
        .crop-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          flex: 1;
          min-width: 0;
        }
        .crop-card-section {
          background: rgba(255,255,255,0.76);
          border: 1px solid #c4e8d4;
          border-radius: 16px;
          padding: 0.85rem 0.95rem;
          box-shadow: 0 1px 4px rgba(34,74,66,0.06);
        }
        .crop-card-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.65rem;
        }
        .crop-card-section-title {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: #1f5c44;
          font-size: 0.96rem;
          font-weight: 800;
          letter-spacing: 0.01em;
        }
        .crop-card-toggle-btn {
          border: 1px solid #bddfcd;
          background: #f8fcf9;
          color: #245a45;
          border-radius: 999px;
          padding: 0.35rem 0.7rem;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }
        .crop-card-field-list {
          padding: 0;
          margin: 0;
          list-style: none;
          display: grid;
          gap: 0.7rem;
        }
        .crop-card-field-item {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
        }
        .crop-card-field-icon {
          width: 1.5rem;
          height: 1.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #eef7f0;
          border-radius: 999px;
          flex-shrink: 0;
          font-size: 0.94rem;
        }
        .crop-card-field-copy {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
        }
        .crop-card-field-label {
          color: #245a45;
          font-weight: 700;
          font-size: 0.88rem;
          line-height: 1.2;
        }
        .crop-card-field-value {
          color: #355a49;
          font-size: 0.95rem;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }
        .crop-card-subsection + .crop-card-subsection {
          margin-top: 0.8rem;
          padding-top: 0.8rem;
          border-top: 1px dashed #cfe4d7;
        }
        .crop-card-subsection-title {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin: 0 0 0.55rem 0;
          color: #30624c;
          font-size: 0.84rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .crop-card-footer {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 0.75rem;
          align-items: center;
          border-top: 1px solid #d5eadf;
          padding-top: 0.85rem;
        }
        .crop-card-meta {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          color: #4a6b5a;
          font-size: 0.77rem;
        }
        .crop-card-buy-link {
          background: ${version === "grow" ? "#1f7a47" : "#228B22"};
          color: #fff;
          padding: 0.5em 0.85em;
          border-radius: 12px;
          border: none;
          font-weight: 800;
          font-size: 0.88rem;
          text-decoration: none;
          box-shadow: 0 2px 6px rgba(34,74,66,0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .crop-card-buy-link:hover,
        .crop-card-buy-link:focus-visible {
          transform: translateY(-1px);
          box-shadow: 0 6px 12px rgba(34,74,66,0.12);
          outline: 2px solid #2d6a4f;
          outline-offset: 2px;
        }
        @media (max-width: 640px) {
          .crop-card {
            padding: 0.95rem;
            gap: 0.85rem;
          }
          .crop-card-header,
          .crop-card-top,
          .crop-card-footer {
            flex-direction: column;
            align-items: stretch;
          }
          .crop-card-actions {
            justify-content: flex-start;
          }
          .crop-card-media {
            width: 100%;
            max-width: 240px;
            flex-basis: auto;
            align-self: center;
          }
          .crop-card-section {
            padding: 0.8rem 0.85rem;
          }
          .crop-card-buy-link {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="crop-card-header">
        <div className="crop-card-heading">
          <span style={{ fontSize: "1.7rem" }} aria-hidden="true">
            🌱
          </span>
          <div className="crop-card-title-wrap">
            <span className="crop-card-title">{styleCropName(cropName)}</span>
            <span className="crop-card-subtitle">
              <span className="crop-card-mode-pill">
                {version === "grow" ? "Grow mode" : "Sow mode"}
              </span>
              <span>{version === "grow" ? "Care tips at a glance" : "Seed-starting details at a glance"}</span>
            </span>
          </div>
        </div>

        <div className="crop-card-actions">
          <button
            type="button"
            className={`crop-card-action-btn ${isFavorite ? "is-favorite" : ""}`}
            onClick={toggleFavorite}
            aria-pressed={isFavorite}
            aria-label={`${isFavorite ? "Remove" : "Save"} ${cropName} as a favorite`}
          >
            <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
            <span>{isFavorite ? "Saved" : "Save"}</span>
          </button>
          <button
            type="button"
            className="crop-card-action-btn"
            onClick={handleShare}
            aria-label={`Share ${cropName}`}
          >
            <span aria-hidden="true">↗</span>
            <span>Share</span>
          </button>
          <span className="crop-card-share-note" aria-live="polite">
            {shareMessage}
          </span>
        </div>
      </div>

      <div className="crop-card-top">
        <div className="crop-card-media">
          <img
            src={plantImage ? `${IMAGE_BASE}/${plantImage}` : DEFAULT_IMAGE}
            alt={cropName}
            className="crop-card-plant-image"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              if (!e.target.src.endsWith("default-flower.png")) {
                e.target.onerror = null;
                e.target.src = DEFAULT_IMAGE;
              }
            }}
          />
        </div>

        <div className="crop-card-body">
          {basicsFields.length > 0 && (
            <section className="crop-card-section" aria-label="Basics">
              {renderSectionHeader("Basics")}
              {renderFieldList(basicsFields, BASICS_HIDDEN_LABELS)}
            </section>
          )}

          {secondaryGroups.length > 0 && (
            <section className="crop-card-section" aria-label={secondaryLabel}>
              {renderSectionHeader(secondaryLabel, {
                onClick: () => setSecondaryExpanded((value) => !value),
                "aria-expanded": secondaryExpanded,
                "aria-controls": `${cardId}-${secondaryLabel.toLowerCase()}`,
                children: secondaryExpanded ? "Hide" : "Show",
              })}

              {secondaryExpanded && (
                <div id={`${cardId}-${secondaryLabel.toLowerCase()}`}>
                  {secondaryGroups.map(({ section, fields }) => (
                    <div key={section} className="crop-card-subsection">
                      {secondaryGroups.length > 1 && (
                        <h3 className="crop-card-subsection-title">
                          <span aria-hidden="true">{SECTION_ICONS[section] || "🌿"}</span>
                          <span>{section}</span>
                        </h3>
                      )}
                      {renderFieldList(fields)}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <div className="crop-card-footer">
        <div className="crop-card-meta">
          <span>Last updated: {lastUpdatedLabel}</span>
          <span>Source note: Dibby Grow Buddy crop reference • buy links open in a new tab.</span>
        </div>

        {buyNowUrl && (
          <a
            href={buyNowUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="crop-card-buy-link"
          >
            <span aria-hidden="true">{version === "grow" ? "🪴" : "🛒"}</span>
            <span>{version === "grow" ? "Shop Grow Supplies" : "Shop Seeds & Supplies"}</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default function CropCard({ cropName, cropData, version = "sow", lastUpdated }) {
  if (cropData) {
    return (
      <CropCardContent
        cropName={cropName}
        cropData={cropData}
        version={version}
        lastUpdated={lastUpdated}
      />
    );
  }

  return <CropCardWithData cropName={cropName} version={version} />;
}
