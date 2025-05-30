import React from "react";

function CropCard({ cropName, cropData }) {
  if (!cropData) return null;

  return (
    <div>
      <h2>{cropName}</h2>
      {Object.entries(cropData).map(([section, fields]) => (
        <div key={section}>
          <h3>{section}</h3>
          <ul>
            {fields.map(({ label, value }) => (
              <li key={label}>
                <strong>{label}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default CropCard;
