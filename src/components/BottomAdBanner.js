import React, { useEffect } from "react";

const AD_HEIGHT = 60; // Adjust this if your ad size changes

const BottomAdBanner = () => {
  useEffect(() => {
    // Google AdSense: re-initialize ads if script is loaded
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        // Handle any errors silently
      }
    }
  }, []);

  return (
    <div
      className="bottom-ad-banner"
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        zIndex: 1000,
        background: "#fff",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.08)",
        textAlign: "center",
        height: `${AD_HEIGHT}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          height: `${AD_HEIGHT}px`,
          margin: "auto",
          maxWidth: "728px", // Responsive max width for desktop
          minWidth: "320px", // Responsive min width for mobile
        }}
        data-ad-client="ca-pub-6136646398761163"
        data-ad-slot="5717468714"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default BottomAdBanner;
