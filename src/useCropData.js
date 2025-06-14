import { useState, useEffect } from "react";

export function useCropData() {
  const [cropData, setCropData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/cropdata.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch crop data");
        return res.json();
      })
      .then((data) => {
        setCropData(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }, []);

  return { cropData, loading, error };
}