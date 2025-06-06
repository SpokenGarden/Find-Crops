import React from "react";

// This component is flexible: it will work with your original deal format OR Amazon API format.
// It will show a card for each deal, using the best available property names.

export default function DealsSection({ deals, linkOutUrl }) {
  // Always show the section, even if no deals, with a friendly message
  return (
    <div style={{
      width: "100%",
      maxWidth: 1200,
      margin: "2rem auto",
      padding: "1rem",
      background: "#e9ffe9",
      borderRadius: 14,
      boxShadow: "0 1px 6px rgba(0,0,0,.07)"
    }}>
      <h3 style={{ color: "#1b5e20", marginTop: 0 }}>🌟 Deals of the Month!</h3>

      {(deals && deals.length > 0) ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem"
        }}>
          {deals.map((deal, idx) => {
            // Fallbacks for Amazon Product Advertising API
            const imageUrl =
              deal.imageUrl ||
              deal.Images?.Primary?.Large?.URL ||
              deal.Images?.Primary?.Medium?.URL ||
              deal.Images?.Primary?.Small?.URL ||
              "";
            const name = deal.name || deal.Title || deal.title || "Garden Deal";
            const dealText = deal.dealText || deal.Description || deal.OfferListing?.Price?.DisplayAmount || deal.price || "";
            const buyUrl = deal.buyUrl || deal.DetailPageURL || "#";

            return (
              <div key={idx} style={{
                background: "#fff",
                borderRadius: 10,
                boxShadow: "0 1px 5px rgba(0,0,0,.04)",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                {imageUrl && (
                  <img src={imageUrl} alt={name} style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                    marginBottom: ".5rem",
                    borderRadius: "6px",
                    background: "#f6f6f6"
                  }}/>
                )}
                <div style={{fontWeight: "bold", marginBottom: ".3rem", textAlign: "center"}}>{name}</div>
                <div style={{ color: "#388e3c", marginBottom: ".5rem", textAlign: "center" }}>{dealText}</div>
                <a
                  href={buyUrl}
                  style={{
                    background: "#ff9800",
                    color: "#fff",
                    border: "none",
                    padding: "0.4rem 1rem",
                    borderRadius: "6px",
                    fontSize: "0.98rem",
                    cursor: "pointer",
                    textDecoration: "none"
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Deal
                </a>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "#888", padding: "2rem 0" }}>
          No deals available right now. Please check back soon!
        </div>
      )}

      {linkOutUrl && (
        <div style={{textAlign: "right", marginTop: "1rem"}}>
          <a
            href={linkOutUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1b5e20", textDecoration: "underline" }}
          >
            More deals on our website &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
