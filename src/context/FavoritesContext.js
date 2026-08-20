import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "./AuthContext";
import { buildFavoritePayload, makeItemId, normalizeFavoriteRecord } from "../utils/favorites";

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
      setLoading(false);
      setFavorites({});
      return;
    }

    if (!supabase) {
      setLoading(false);
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
            const normalized = normalizeFavoriteRecord(row);
            map[normalized.item_id] = {
              item_name: normalized.item_name,
              item_type: normalized.item_type,
              vendor: normalized.vendor,
              payload: normalized.payload,
              created_at: normalized.created_at,
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
        const payload = buildFavoritePayload(cropName, cropData);
        const row = {
          user_id: user.id,
          item_id: itemId,
          item_name: payload.favoriteMeta.itemName,
          item_type: payload.favoriteMeta.itemType,
          vendor: payload.favoriteMeta.vendor,
          payload,
        };

        const { error } = await supabase
          .from("favorites")
          .upsert(row, { onConflict: "user_id,item_id" });

        if (!error) {
          const normalized = normalizeFavoriteRecord(row);
          setFavorites((prev) => ({
            ...prev,
            [itemId]: {
              item_name: normalized.item_name,
              item_type: normalized.item_type,
              vendor: normalized.vendor,
              payload: normalized.payload,
              created_at: normalized.created_at,
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
