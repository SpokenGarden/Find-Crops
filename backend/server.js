require('dotenv').config();
const express = require('express');
const cors = require('cors');
app.use(cors());
const { fetchGardenPatioDeals } = require('./amazon');

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/api/deals', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "5", 10);
    const items = await fetchGardenPatioDeals(20); // fetch more for filtering

    // Only keep items with a discount or promotion
    const deals = items.filter(item => {
      const listing = item.Offers?.Listings?.[0];
      return listing?.SavingBasis || (listing?.Promotions && listing.Promotions.length > 0);
    }).slice(0, limit);

    res.json({ deals });
  } catch (err) {
    console.error("Error fetching deals:", err);
    res.status(500).json({ error: "Failed to fetch deals" });
  }
});

app.get('/', (req, res) => {
  res.send('Amazon Deals API is running.');
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
