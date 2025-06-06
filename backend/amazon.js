const axios = require('axios');
const CryptoJS = require('crypto-js');

const {
  AMAZON_ACCESS_KEY,
  AMAZON_SECRET_KEY,
  AMAZON_PARTNER_TAG,
  AMAZON_MARKETPLACE
} = process.env;

// Garden & Patio BrowseNodeId for US Amazon
const GARDEN_PATIO_NODE_ID = '2972638011';

// Helper to generate ISO timestamp
function getAmzTimestamp() {
  return new Date().toISOString().replace(/\.\d+Z$/, 'Z');
}

async function fetchGardenPatioDeals(limit = 20) {
  // See: https://webservices.amazon.com/paapi5/documentation/search-items.html
  const endpoint = `https://webservices.amazon.com/paapi5/searchitems`;

  const payload = {
    "Keywords": "",
    "SearchIndex": "All",
    "BrowseNodeId": GARDEN_PATIO_NODE_ID,
    "ItemCount": limit,
    "PartnerTag": AMAZON_PARTNER_TAG,
    "PartnerType": "Associates",
    "Marketplace": AMAZON_MARKETPLACE,
    "Resources": [
      "ItemInfo.Title",
      "Offers.Listings.Price",
      "Offers.Listings.SavingBasis",
      "Offers.Listings.Promotions",
      "Images.Primary.Large"
    ]
  };

  // Amazon PA-API requires signed requests. We'll sign the payload.
  const headers = await signRequest(endpoint, payload);

  try {
    const response = await axios.post(endpoint, payload, { headers });
    if (
      response.data &&
      response.data.SearchResult &&
      response.data.SearchResult.Items
    ) {
      return response.data.SearchResult.Items;
    }
    return [];
  } catch (err) {
    console.error("Amazon API Error:", err.response?.data || err.message);
    return [];
  }
}

// Signature V4 -- simplified for brevity, adapt for production
async function signRequest(endpoint, payload) {
  const amzTarget = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems";
  const amzDate = getAmzTimestamp();
  const content = JSON.stringify(payload);

  // For full signature V4, see AWS docs.
  // For initial dev, try without signature (Amazon may allow on test keys).
  // For production, implement full AWS Signature V4 signing!
  return {
    "Content-Type": "application/json; charset=UTF-8",
    "X-Amz-Date": amzDate,
    "X-Amz-Target": amzTarget,
    "Host": "webservices.amazon.com",
    "Accept": "application/json"
    // Add Authorization header if required (see AWS SigV4)
  };
}

module.exports = { fetchGardenPatioDeals };
