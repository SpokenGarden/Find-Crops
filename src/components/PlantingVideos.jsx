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

const PlantingVideos = ({ onBack }) => (
  <div className="videos-container">
    <style>{`
      .videos-container {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 2rem 0;
        background: #f9f9f6;
        border-radius: 16px;
        position: relative;
        min-height: 400px;
        box-sizing: border-box;
      }
      .videos-inner-content {
        padding: 0 2.5rem;
      }
      .gp-back-btn {
        position: absolute;
        top: 22px;
        left: 22px;
        z-index: 20;
        background: #b7e6cf;
        border: none;
        border-radius: 13px;
        padding: 0.7em 1.3em;
        font-size: 1.13rem;
        color: #155943;
        font-weight: 700;
        box-shadow: 0 2px 10px rgba(34,74,66,0.08);
        cursor: pointer;
        transition: background 0.18s;
      }
      @media (max-width: 900px) {
        .videos-container {
          max-width: 98vw;
        }
        .videos-inner-content {
          padding: 0 2vw;
        }
      }
      @media (max-width: 700px) {
        .videos-container {
          padding-left: 3vw;
          padding-right: 3vw;
        }
        .videos-inner-content {
          padding: 0 1vw;
        }
        .gp-back-btn {
          position: static;
          display: block;
          margin-bottom: 0.85em;
          margin-left: 0;
          margin-top: 0.5em;
          width: auto;
        }
      }
      @media (max-width: 480px) {
        .videos-container {
          padding-left: 2vw;
          padding-right: 2vw;
        }
        .videos-inner-content {
          padding: 0;
        }
        .gp-back-btn {
          font-size: 1rem;
          padding: 0.6em 1em;
        }
      }
    `}</style>
    {/* Responsive Back Button */}
    <button className="gp-back-btn" onClick={onBack}>
      ← Back to Home
    </button>
    <div className="videos-inner-content">
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
      {/* Bottom Back Button */}
      <div style={{ marginTop: "3rem", textAlign: "center" }}>
        <button className="gp-back-btn" onClick={onBack}>
          ← Back to Home
        </button>
      </div>
    </div>
  </div>
);

export default PlantingVideos;
