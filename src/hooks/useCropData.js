import { useState, useEffect } from "react";

// Files to load (leave them as separate files in public/)
const FILES = ["bulbs.json", "flowers.json", "herbs.json", "vegetables.json"];

function buildUrl(file) {
  // Use PUBLIC_URL if set at build time, otherwise load file from same folder as index.html
  if (typeof window === "undefined") return file;
  const publicUrl = (process.env.PUBLIC_URL || "").replace(/\/$/, "");
  if (publicUrl) return `${publicUrl}/${file}`.replace(/\/\/+/g, "/");
  // derive base folder (handles /app/ or root)
  const path = window.location.pathname;
  const base = path.endsWith("/") ? path : path.replace(/\/[^\/]*$/, "/");
  return `${base}${file}`.replace(/\/\/+/g, "/");
}

export function useCropData() {
  const [cropData, setCropData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const urls = FILES.map((f) => buildUrl(f));
        const responses = await Promise.all(urls.map((u) => fetch(u)));

        // If any specific file is missing, include a clear message
        for (let i = 0; i < responses.length; i++) {
          if (!responses[i].ok) {
            throw new Error(`Failed to load ${urls[i]} (${responses[i].status})`);
          }
        }

        const jsons = await Promise.all(responses.map((r) => r.json()));

        // Merge objects into one map: all files should be objects { cropName: cropData }
        const merged = Object.assign({}, ...jsons);

        if (mounted) {
          setCropData(merged);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setError(e);
          setLoading(false);
        }
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  return { cropData, loading, error };
}
