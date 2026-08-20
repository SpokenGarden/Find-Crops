import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./AuthContext";

function makeItemId(cropName) {
  return String(cropName || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function extractVendor(cropData) {
  if (!cropData) return null;
  for (const key of ["Link", "Links"]) {
    const fields = cropData[key];
    if (Array.isArray(fields)) {
      const buyNow = fields.find(
        (f) =>
          typeof f.label === "string" &&
          f.label.trim().toLowerCase() === "buy now" &&
          typeof f.value === "string" &&
          /^https?:\/\//i.test(f.value.trim())
      );
      if (buyNow) {
        try {
          return new URL(buyNow.value.trim()).hostname.replace(/^www\./, "");
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function extractItemType(cropData) {
  if (!cropData) return null;
  if (Array.isArray(cropData.Basics)) {
    const t = cropData.Basics.find((f) => f.label && f.label.toLowerCase() === "type");
    if (t && t.value) return String(t.value).toLowerCase();
  }
  return null;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  // favorites map:  item_id → { item_name, item_type, vendor, payload }
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(false);

  // Load favorites whenever auth state changes
  useEffect(() => {
    if (!user) {
      setFavorites({});
      return;
    }

    if (!supabase) {
      setFavorites({});
      return;
    }

    let cancelled = false;
    setLoading(true);

    supabase
      .from("favorites")
      .select("item_id, item_name, item_type, vendor, payload, created_at")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("FavoritesContext load error:", error.message);
          setFavorites({});
        } else {
          const map = {};
          (data || []).forEach((row) => {
            map[row.item_id] = {
              item_name: row.item_name,
              item_type: row.item_type,
              vendor: row.vendor,
              payload: row.payload,
              created_at: row.created_at,
            };
          });
          setFavorites(map);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const isFavorite = useCallback(
    (cropName) => Boolean(favorites[makeItemId(cropName)]),
    [favorites]
  );

  const count = Object.keys(favorites).length;

  /**
   * Toggle a favorite.
   * Returns { needsAuth: true } when user is not logged in.
   */
  const toggleFavorite = useCallback(
    async (cropName, cropData) => {
      const itemId = makeItemId(cropName);
      const alreadyFavorited = Boolean(favorites[itemId]);

      // ---- Logged-out: always require auth ----
      if (!user) {
        return { needsAuth: true };
      }

      // ---- Logged-in: Supabase ----
      if (!supabase) return {};

      if (alreadyFavorited) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("item_id", itemId);

        if (!error) {
          setFavorites((prev) => {
            const next = { ...prev };
            delete next[itemId];
            return next;
          });
        } else {
          console.error("toggleFavorite delete error:", error.message);
        }
      } else {
        const row = {
          user_id: user.id,
          item_id: itemId,
          item_name: cropName,
          item_type: extractItemType(cropData),
          vendor: extractVendor(cropData),
          payload: cropData ? JSON.parse(JSON.stringify(cropData)) : null,
        };

        const { error } = await supabase
          .from("favorites")
          .upsert(row, { onConflict: "user_id,item_id" });

        if (!error) {
          setFavorites((prev) => ({
            ...prev,
            [itemId]: {
              item_name: row.item_name,
              item_type: row.item_type,
              vendor: row.vendor,
              payload: row.payload,
            },
          }));
        } else {
          console.error("toggleFavorite upsert error:", error.message);
        }
      }
      return {};
    },
    [user, favorites]
  );

  /**
   * Remove a favorite directly by its stable itemId (no re-derivation from name).
   * Returns { needsAuth: true } when user is not logged in.
   */
  const removeFavoriteById = useCallback(
    async (itemId) => {
      if (!user) return { needsAuth: true };
      if (!supabase) return {};

      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("item_id", itemId);

      if (!error) {
        setFavorites((prev) => {
          const next = { ...prev };
          delete next[itemId];
          return next;
        });
      } else {
        console.error("removeFavoriteById error:", error.message);
      }
      return {};
    },
    [user]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavoriteById, count, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  return useContext(FavoritesContext);
}
