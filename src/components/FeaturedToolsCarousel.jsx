import React, { useState } from "react";

// featuredItems: array of { imageUrl, name, description, buyUrl }
export default function FeaturedToolsCarousel({ featuredItems }) {
  const [current, setCurrent] = useState(0);
  const total = featuredItems.length;

  const nextSlide = () => setCurrent((current + 1) % total);
  const prevSlide = () => setCurrent((current - 1 + total) % total);

  if (!featuredItems || featuredItems.length === 0) return null;

  const item = featuredItems[current];

  return (
    <div style={{
      width: "100%",
      maxWidth: 500,
      margin: "2rem auto",
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 10px rgba(0,0,0,.08)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "1rem"
    }}>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <button onClick={prevSlide} aria-label="Previous" style={{ background: "none", border: "none", fontSize: "2rem", cursor: "pointer" }}>&lt;</button>
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{
            width: "120px",
            height: "120px",
            objectFit: "contain",
            margin: "0 2rem",
            borderRadius: "8px",
            background: "#f6f6f6"
          }}
        />
        <button onClick={nextSlide} aria-label="Next" style={{ background: "none", border: "none", fontSize: "2rem", cursor: "pointer" }}>&gt;</button>
      </div>
      <h4 style={{ margin: "1rem 0 0.5rem 0", color: "#22543d" }}>{item.name}</h4>
      <p style={{ margin: 0, textAlign: "center" }}>{item.description}</p>
      {item.buyUrl && (
        <a
          href={item.buyUrl}
          style={{
            marginTop: "1rem",
            background: "#40916c",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1.2rem",
            borderRadius: "6px",
            fontSize: "1rem",
            cursor: "pointer",
            textDecoration: "none",
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy Now
        </a>
      )}
      <div style={{ marginTop: ".5rem", fontSize: ".9em", color: "#888" }}>
        {current + 1} / {total}
      </div>
    </div>
  );
}
