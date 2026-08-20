import React, { useMemo } from "react";
import { useFavorites } from "../hooks/useFavorites";

const styles = `
.fav-panel {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: 340px;
  max-width: 95vw;
  background: #ffffff;
  border: 1px solid #dbeeda;
  border-radius: 14px;
  box-shadow: 0 10px 32px rgba(17,24,39,0.14);
  z-index: 9000;
  overflow: hidden;
}
.fav-panel-header {
  padding: 0.65rem 0.9rem;
  background: #eef7f0;
  border-bottom: 1px solid #dbeeda;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fav-panel-title {
  color: #2d6a4f;
  font-weight: 800;
  font-size: 0.95rem;
  margin: 0;
}
.fav-panel-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: #4a6b5a;
  line-height: 1;
  padding: 0.15rem 0.35rem;
  border-radius: 6px;
}
.fav-panel-close:hover { background: rgba(0,0,0,0.06); }
.fav-panel-body {
  max-height: 420px;
  overflow-y: auto;
  padding: 0.6rem 0.75rem 0.75rem;
}
.fav-empty {
  text-align: center;
  color: #4a6b5a;
  padding: 1.4rem 0.5rem;
  font-size: 0.9rem;
}
.fav-item {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.45rem 0.5rem;
  border-radius: 8px;
  margin-bottom: 0.45rem;
  border: 1px solid #e0ede5;
  background: #fbfefc;
}
.fav-item:hover { background: #f4fbf6; }
.fav-item-media {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  overflow: hidden;
  flex: 0 0 56px;
  background: linear-gradient(180deg, #edf5ef 0%, #d8eadf 100%);
  border: 1px solid #d0ede1;
}
.fav-item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.fav-item-info {
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
  min-width: 0;
  flex: 1 1 auto;
}
.fav-item-name {
  font-weight: 700;
  font-size: 0.92rem;
  color: #155943;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fav-item-detail {
  font-size: 0.76rem;
  color: #6b8f7a;
  line-height: 1.35;
  overflow-wrap: anywhere;
}
.fav-item-actions {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  flex: 0 0 auto;
}
.fav-remove-btn {
  background: #ffffff;
  border: 1px solid #c4ddd0;
  color: #b72b2b;
  border-radius: 999px;
  padding: 0.22rem 0.55rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s;
}
.fav-remove-btn:hover { background: #fff0f0; border-color: #e07070; }
`;

const IMAGE_BASE = `${process.env.PUBLIC_URL || ""}/images/flowers`;
const DEFAULT_IMAGE = `${IMAGE_BASE}/default-flower.png`;

function toTitleCase(value) {
  return String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildDetailLines(meta) {
  const summary = [
    meta.itemType ? toTitleCase(meta.itemType) : null,
    meta.kind,
  ].filter(Boolean);
  const additional = [
    meta.hardinessZones ? `Zones ${meta.hardinessZones}` : null,
    meta.season,
    meta.sun ? `Sun: ${meta.sun}` : null,
    meta.water ? `Water: ${meta.water}` : null,
    meta.soil ? `Soil: ${meta.soil}` : null,
  ].filter(Boolean);

  return [...(summary.length ? [summary.join(" • ")] : []), ...additional].slice(0, 3);
}

export default function FavoritesList({ onClose, onNeedsAuth }) {
  const { favorites, removeFavoriteById, count } = useFavorites();

  const items = useMemo(() => {
    return Object.entries(favorites)
      .map(([itemId, favorite]) => ({ itemId, ...favorite }))
      .sort((a, b) => a.item_name.localeCompare(b.item_name));
  }, [favorites]);

  const handleRemove = async (itemId) => {
    const result = await removeFavoriteById(itemId);
    if (result && result.needsAuth && onNeedsAuth) onNeedsAuth();
  };

  return (
    <>
      <style>{styles}</style>
      <div
        className="fav-panel"
        role="dialog"
        aria-label={`Favorites (${count})`}
      >
        <div className="fav-panel-header">
          <h3 className="fav-panel-title">❤️ Favorites ({count})</h3>
          <button
            type="button"
            className="fav-panel-close"
            aria-label="Close favorites"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="fav-panel-body">
          {count === 0 ? (
            <div className="fav-empty">
              <p>No favorites yet.</p>
              <p style={{ fontSize: "0.82rem", marginTop: "0.3rem", opacity: 0.8 }}>
                Tap the ♡ heart on any plant card to save it here.
              </p>
            </div>
          ) : (
            items.map((favorite) => {
              const meta = favorite.payload?.favoriteMeta || {};
              const detailLines = buildDetailLines(meta);
              const imageSrc = meta.image ? `${IMAGE_BASE}/${meta.image}` : DEFAULT_IMAGE;
              return (
                <div key={favorite.itemId} className="fav-item">
                  <div className="fav-item-media" aria-hidden="true">
                    <img
                      src={imageSrc}
                      alt=""
                      className="fav-item-image"
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        if (!event.target.src.endsWith("default-flower.png")) {
                          event.target.onerror = null;
                          event.target.src = DEFAULT_IMAGE;
                        }
                      }}
                    />
                  </div>
                  <div className="fav-item-info">
                    <span className="fav-item-name" title={favorite.item_name}>{favorite.item_name}</span>
                    {detailLines.map((line) => (
                      <span key={`${favorite.itemId}-${line}`} className="fav-item-detail">
                        {line}
                      </span>
                    ))}
                  </div>
                  <div className="fav-item-actions">
                    <button
                      type="button"
                      className="fav-remove-btn"
                      onClick={() => handleRemove(favorite.itemId)}
                      aria-label={`Remove ${favorite.item_name} from favorites`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
