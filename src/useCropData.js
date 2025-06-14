import { useState, useEffect } from "react";

/**
 * Custom hook to fetch and provide crop data from the public/cropdata.json file.
 * Returns: { cropData, loading, error }
 */
export function useCropData() {
  const [cropData, setCropData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/cropdata.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch crop data: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setCropData(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (isMounted) {
          setError(e);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { cropData, loading, error };
}
