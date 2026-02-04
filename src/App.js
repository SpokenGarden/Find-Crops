// src/App.js

import React, { useEffect, useState } from 'react';
import './App.css';
import plantsData from './plantsData'; // Assuming this imports plant data

const App = () => {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // On initial app load, set all plant categories to search results
    setSearchResults(plantsData); // plantsData should contain the four categories
  }, []);

  return (
    <div className="App">
      <h1>Plant Search</h1>
      <div className="search-results">
        {searchResults.map((plant, index) => (
          <div key={index} className="plant-item">
            <h2>{plant.name}</h2>
            <p>{plant.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;