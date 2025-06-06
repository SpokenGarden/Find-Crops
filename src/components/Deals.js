import React, { useEffect, useState } from "react";
import { getAmazonDeals } from "../getDeals";

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAmazonDeals(5)
      .then(setDeals)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading deals...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Top Amazon Garden & Patio Deals</h2>
      <ul>
        {deals.map((item) => (
          <li key={item.ASIN}>
            <img
              src={item.Images?.Primary?.Large?.URL}
              alt={item.ItemInfo?.Title?.DisplayValue}
              width={100}
            />
            <div>{item.ItemInfo?.Title?.DisplayValue}</div>
            <div>
              {item.Offers?.Listings?.[0]?.Price?.DisplayAmount}{" "}
              {item.Offers?.Listings?.[0]?.SavingBasis && (
                <span>
                  (was {item.Offers.Listings[0].SavingBasis.DisplayAmount})
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
