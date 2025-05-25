import React from "react";

const CropSearchResults = ({ crops, calendarData }) => {
  const renderCalendarTable = () => {
    if (!calendarData || calendarData.length === 0) {
      return "<div style='color:#b7b7b7;text-align:center;'>No calendar to show. Please enter a last frost date and search for crops.</div>";
    }
    let table = `<table style="width:100%;border-collapse:collapse;margin-top:1rem;">
      <thead>
        <tr style="background:#e6f4ea;">
          <th style="padding:0.5rem;border:1px solid #ccc;">Week of</th>
          <th style="padding:0.5rem;border:1px solid #ccc;">Sow Indoors</th>
          <th style="padding:0.5rem;border:1px solid #ccc;">Sow Outdoors</th>
        </tr>
      </thead>
      <tbody>`;
    calendarData.forEach((week, i) => {
      table += `<tr>
        <td style="border:1px solid #ccc;padding:0.5rem;">
          ${new Date(week.weekStart).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          ${week.week === 0 ? " (Frost)" : ""}
        </td>
        <td style="border:1px solid #ccc;padding:0.5rem;">
          ${week.indoors.length ? week.indoors.join(", ") : "-"}
        </td>
        <td style="border:1px solid #ccc;padding:0.5rem;">
          ${week.outdoors.length ? week.outdoors.join(", ") : "-"}
        </td>
      </tr>`;
    });
    table += `</tbody></table>`;
    return table;
  };

  const handleOpenCalendar = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Sowing Calendar</title>
          <style>
            body { font-family: Poppins, sans-serif; background: #fdfdfc; padding: 2rem; }
            h2 { color: #2d6a4f; }
          </style>
        </head>
        <body>
          <h2>📆 Complete Sowing Calendar</h2>
          ${renderCalendarTable()}
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div>
      {/* Crops Found Section */}
      <h2 style={{ color: "#2d6a4f", marginTop: "2rem" }}>
        🌾 {crops.length} Crop(s) Found:
      </h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {crops.length === 0 && (
          <li>No crops found for your criteria.</li>
        )}
        {crops.map((crop, index) => (
          <li
            key={index}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              backgroundColor: "#e6f4ea",
              borderRadius: "8px"
            }}
          >
            <strong>{crop.Crop}</strong> – {crop.Type}
            <br />
            Sun: {crop.Sun_Requirement} | Water: {crop.Water_Need} | Soil: {crop.Soil_Preference}
          </li>
        ))}
      </ul>
      {/* Sowing Calendar Button Only */}
      <button
        style={{
          marginTop: "1.5rem",
          backgroundColor: "#40916c",
          color: "white",
          padding: "0.75rem",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem",
          cursor: "pointer"
        }}
        onClick={handleOpenCalendar}
        disabled={!calendarData || calendarData.length === 0}
        title={
          !calendarData || calendarData.length === 0
            ? "Run a search first to see the calendar"
            : undefined
        }
      >
        Show Sowing Calendar
      </button>
    </div>
  );
};

export default CropSearchResults;
