require('dotenv').config();
const express = require('express');
const { fetchGardenPatioDeals } = require('./amazon');

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/api/deals', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "5", 10);
    const deals = await fetchGardenPatioDeals(limit);
    res.json({ deals });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch deals" });
  }
});

app.get('/', (req, res) => {
  res.send('Amazon Deals API is running.');
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});