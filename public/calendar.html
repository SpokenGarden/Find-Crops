<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sowing Calendar</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 2rem;
      background: #f9f9f9;
      color: #333;
    }
    h1 {
      text-align: center;
      color: #2d6a4f;
    }
    .month {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .week {
      margin-top: 1rem;
    }
    .label {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>📅 Your Sowing Calendar</h1>
  <div id="calendar">Loading...</div>

  <script>
    const rawCrops = JSON.parse(localStorage.getItem("sowingCalendar") || "[]");

    function getWeekStart(dateStr) {
      const date = new Date(dateStr);
      const day = date.getDay();
      const diff = date.getDate() - day;
      return new Date(date.setDate(diff));
    }

    function buildSowingCalendar(crops, frostDateStr) {
      const calendar = {};
      crops.forEach(crop => {
        const indoorsStart = crop.Sow_Indoors_Start;
        const outdoorsStart = crop.Sow_Outdoors_Start;

        if (indoorsStart) {
          const week = getWeekStart(indoorsStart).toLocaleDateString();
          if (!calendar[week]) calendar[week] = { indoors: [], outdoors: [] };
          calendar[week].indoors.push(crop.Crop);
        }

        if (outdoorsStart) {
          const week = getWeekStart(outdoorsStart).toLocaleDateString();
          if (!calendar[week]) calendar[week] = { indoors: [], outdoors: [] };
          calendar[week].outdoors.push(crop.Crop);
        }
      });

      return Object.entries(calendar).sort((a, b) => new Date(a[0]) - new Date(b[0]));
    }

    const frostDate = localStorage.getItem("frostDate") || new Date().toISOString().slice(0, 10);
    const calendarData = buildSowingCalendar(rawCrops, frostDate);

    const calendarContainer = document.getElementById("calendar");
    calendarContainer.innerHTML = "";

    if (calendarData.length === 0) {
      calendarContainer.innerHTML = "<p>No sowing dates available.</p>";
    }

    calendarData.forEach(([week, crops]) => {
      const wrapper = document.createElement("div");
      wrapper.className = "month";
      wrapper.innerHTML = `<h2>📅 Week of ${week}</h2>
        <p class="label">🌱 Indoors: ${crops.indoors.join(", ") || "-"}</p>
        <p class="label">🌿 Outdoors: ${crops.outdoors.join(", ") || "-"}</p>`;
      calendarContainer.appendChild(wrapper);
    });
  </script>
</body>
</html>
