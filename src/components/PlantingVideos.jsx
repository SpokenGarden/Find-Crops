import React from "react";
import BackHomeButton from "./BackHomeButton";

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
  }, 
  {
    title: "Winter Seed Sowing in Jugs ❄️",
    url: "https://youtu.be/sYWimXvcuaE"
  },
{
  title: "Cool Season Vegetable Seed Sowing 🥕",
    url: "https://youtu.be/ji4-uvgvVY0"
];

const PlantingVideos = ({ onBack }) => (
  <div
    style={{
      maxWidth: 800,
      margin: "2rem auto",
      padding: "2rem",
      background: "#f9f9f6",
      borderRadius: 16,
      position: "relative",
      minHeight: 400,
    }}
  >
    {/* Top Left */}
    <div style={{ position: "absolute", top: 20, left: 20 }}>
      <BackHomeButton onClick={onBack} />
    </div>
    <h2 style={{ color: "#22543d", marginTop: 0, textAlign: "center" }}>🎥 Watch Planting Videos</h2>
    <p>Learn how to plant seeds, transplant seedlings, and more:</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center" }}>
      {sampleVideos.map((vid, idx) => (
        <div key={idx} style={{ maxWidth: 350 }}>
          <div style={{ marginBottom: 10, fontWeight: 600 }}>{vid.title}</div>
          <div style={{
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(34,74,66,0.10)"
          }}>
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
    {/* Bottom */}
    <div style={{ marginTop: "3rem", textAlign: "center" }}>
      <BackHomeButton onClick={onBack} />
    </div>
  </div>
);

export default PlantingVideos;
