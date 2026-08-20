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
.fav-vendor-group {
  margin-bottom: 0.9rem;
}
.fav-vendor-label {
  font-size: 0.77rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #4a6b5a;
  border-bottom: 1px solid #e0ede5;
  padding-bottom: 0.25rem;
  margin-bottom: 0.4rem;
}
.fav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  padding: 0.45rem 0.5rem;
  border-radius: 8px;
  margin-bottom: 0.2rem;
}
.fav-item:hover { background: #f4fbf6; }
.fav-item-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}
.fav-item-name {
  font-weight: 700;
  font-size: 0.92rem;
  color: #155943;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fav-item-type {
  font-size: 0.78rem;
  color: #4a6b5a;
}
.fav-remove-btn {
  background: none;
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

export default function FavoritesList({ onClose, onNeedsAuth }) {
  const { favorites, toggleFavorite, count } = useFavorites();

  // Group by vendor
  const groups = useMemo(() => {
    const grouped = {};
    Object.entries(favorites).forEach(([itemId, fav]) => {
      const key = fav.vendor || "Other";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push({ itemId, ...fav });
    });
    // Sort entries within each group alphabetically
    Object.values(grouped).forEach((arr) =>
      arr.sort((a, b) => a.item_name.localeCompare(b.item_name))
    );
    // Sort group keys: named vendors first, "Other" last
    return Object.entries(grouped).sort(([a], [b]) => {
      if (a === "Other") return 1;
      if (b === "Other") return -1;
      return a.localeCompare(b);
    });
  }, [favorites]);

  const handleRemove = async (cropName, payload) => {
    const result = await toggleFavorite(cropName, payload);
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
            groups.map(([vendor, items]) => (
              <div key={vendor} className="fav-vendor-group">
                <div className="fav-vendor-label">{vendor}</div>
                {items.map(({ itemId, item_name, item_type, payload }) => (
                  <div key={itemId} className="fav-item">
                    <div className="fav-item-info">
                      <span className="fav-item-name" title={item_name}>{item_name}</span>
                      {item_type && (
                        <span className="fav-item-type">
                          {item_type.charAt(0).toUpperCase() + item_type.slice(1)}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="fav-remove-btn"
                      onClick={() => handleRemove(item_name, payload)}
                      aria-label={`Remove ${item_name} from favorites`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
