import React from "react";
import "./TopPlantBanner.css";

const FALLBACK_IMAGE = `${process.env.PUBLIC_URL || ""}/images/flowers/default-flower.png`;

function getPhotoFileName(cropData) {
  if (!cropData || !Array.isArray(cropData.Image)) return "";
  const photo = cropData.Image.find(
    (field) =>
      typeof field?.label === "string" &&
      field.label.trim().toLowerCase() === "photo" &&
      typeof field?.value === "string"
  );
  return photo ? photo.value.trim() : "";
}

export default function TopPlantBanner({ crops = [], activeCropName = "", onSearchCrop }) {
  if (!crops.length) return null;

  return (
    <nav className="top-plant-banner" aria-label="Featured plant shortcuts">
      <div className="top-plant-banner-track">
        {crops.map(({ name, data }) => {
          const photoFileName = getPhotoFileName(data);
          const imageSrc = photoFileName
            ? `${process.env.PUBLIC_URL || ""}/images/flowers/${photoFileName}`
            : FALLBACK_IMAGE;
          const isActive = activeCropName.trim().toLowerCase() === String(name).trim().toLowerCase();

          return (
            <button
              key={name}
              type="button"
              className={`top-plant-banner-item${isActive ? " is-active" : ""}`}
              onClick={() => onSearchCrop && onSearchCrop(name)}
              aria-pressed={isActive}
            >
              <img
                src={imageSrc}
                alt=""
                className="top-plant-banner-thumb"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  if (!e.target.src.endsWith("default-flower.png")) {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_IMAGE;
                  }
                }}
              />
              <span className="top-plant-banner-name">{name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
