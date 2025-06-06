import React from "react";

// deals: array of { imageUrl, name, dealText, buyUrl }
export default function DealsSection({ deals, linkOutUrl }) {
  if (!deals || deals.length === 0) return null;

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
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1.5rem"
      }}>
        {deals.map((deal, idx) => (
          <div key={idx} style={{
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 1px 5px rgba(0,0,0,.04)",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            {deal.imageUrl && (
              <img src={deal.imageUrl} alt={deal.name} style={{
                width: "100px",
                height: "100px",
                objectFit: "contain",
                marginBottom: ".5rem",
                borderRadius: "6px",
                background: "#f6f6f6"
              }}/>
            )}
            <div style={{fontWeight: "bold", marginBottom: ".3rem"}}>{deal.name}</div>
            <div style={{ color: "#388e3c", marginBottom: ".5rem" }}>{deal.dealText}</div>
            <a
              href={deal.buyUrl}
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
        ))}
      </div>
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