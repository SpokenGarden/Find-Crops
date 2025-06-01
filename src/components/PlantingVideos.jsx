import React from "react";

const sampleVideos = [
  {
    title: "How to Start Seeds Indoors 🌱",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    title: "Transplanting Seedlings to the Garden 🏡",
    url: "https://www.youtube.com/embed/YOUR_VIDEO_ID_2"
  },
  {
    title: "Direct Sowing in the Garden 🌻",
    url: "https://www.youtube.com/embed/YOUR_VIDEO_ID_3"
  }
];

const PlantingVideos = ({ onBack }) => (
  <div style={{ maxWidth: 800, margin: "2rem auto", padding: "2rem", background: "#f9f9f6", borderRadius: 16 }}>
    <button
      onClick={onBack}
      style={{ marginBottom: "2rem", padding: "0.7rem 2rem", fontSize: "1rem" }}
    >
      ← Back to Home
    </button>
    <h2 style={{ color: "#22543d" }}>🎥 Watch Planting Videos</h2>
    <p>Learn how to plant seeds, transplant seedlings, and more:</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center" }}>
      {sampleVideos.map((vid, idx) => (
        <div key={idx} style={{ maxWidth: 350 }}>
          <div style={{ marginBottom: 10, fontWeight: 600 }}>{vid.title}</div>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 10, boxShadow: "0 2px 8px rgba(34,74,66,0.10)" }}>
            <iframe
              src={vid.url}
              title={vid.title}
              frameBorder="0"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0, left: 0, width: "100%", height: "100%",
                borderRadius: 10
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PlantingVideos;