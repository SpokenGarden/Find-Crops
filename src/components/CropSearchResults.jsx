import React from 'react';

const CropSearchResults = ({ crops, calendarUrl }) => {
  return (
    <div>
      <h2>Crops Found</h2>
      <ul>
        {crops.map(crop => (
          <li key={crop.id}>{crop.name}</li>
        ))}
      </ul>
      <button
        style={{ marginTop: '1rem' }}
        onClick={() => window.open(calendarUrl, '_blank')}
      >
        Show Sowing Calendar
      </button>
    </div>
  );
};

export default CropSearchResults;