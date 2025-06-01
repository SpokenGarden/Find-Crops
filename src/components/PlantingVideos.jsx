import React from "react";
import BackHomeButton from "./BackHomeButton";

const sampleVideos = [
  {
    title: "Live-Winter Seed Sowing Methods & Seeds to Start",
    url: "https://www.youtube.com/embed/I_p2CG2XNkQ"
  },
  {
    title: "4 Signs Your Seedlings Need to Be Transplanted",
    url: "https://www.youtube.com/embed/tWf0JtxEjY8"
  },
  {
    title: "6 Late Spring Flower Seeds To Sow For Summer Flowers",
    url: "https://www.youtube.com/embed/4L8yIFoX2j8YOUR_VIDEO_ID_3"
  },
  {
    title: "Winter Seed Sowing in Jugs",
    url: "https://www.youtube.com/embed/sYWimXvcuaE"
  },
  {
    title: "Cool Season Vegetable Seed Sowing",
    url: "https://www.youtube.com/embed/ji4-uvgvVY0"
  }
];

const VIDEO_WIDTH = 350; // px
const VIDEO_ASPECT_RATIO = 9 / 16; // 16:9 aspect ratio

const PlantingVideos = ({ onBack }) => (
  <div
    style={{
      maxWidth: 1200,
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
    <h2 style={{ color: "#22543d", marginTop: 0, textAlign: "center" }}> Watch Planting Videos</h2>
    <p>Learn how to plant seeds, transplant seedlings, and more:</p>
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "2rem",
      justifyContent: "center"
    }}>
      {sampleVideos.map((vid, idx) => (
        <div
          key={idx}
          style={{
            width: VIDEO_WIDTH,
            flex: `0 0 ${VIDEO_WIDTH}px`,
            marginBottom: "2rem"
          }}
        >
          <div style={{ marginBottom: 10, fontWeight: 600, textAlign: "center" }}>{vid.title}</div>
          <div style={{
            position: "relative",
            width: "100%",
            paddingBottom: "56.25%", // 16:9 aspect ratio
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
