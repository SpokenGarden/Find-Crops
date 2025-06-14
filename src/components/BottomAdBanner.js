import React, { useEffect } from "react";

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
    <div style={{
      position: "fixed",
      left: 0,
      bottom: 0,
      width: "100%",
      zIndex: 1000,
      background: "#fff",
      boxShadow: "0 -2px 8px rgba(0,0,0,0.08)",
      textAlign: "center",
    }}>
      <ins className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "90px", margin: "auto" }}
        data-ad-client="ca-pub-6136646398761163"   // <-- replace with your AdSense publisher ID
        data-ad-slot="5717468714"                 // <-- replace with your AdSense slot ID
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default BottomAdBanner;
