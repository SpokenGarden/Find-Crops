const axios = require('axios');
const aws4 = require('aws4');
const url = require('url');

const {
  AMAZON_ACCESS_KEY,
  AMAZON_SECRET_KEY,
  AMAZON_PARTNER_TAG,
  AMAZON_MARKETPLACE
} = process.env;

// Garden & Patio BrowseNodeId for US Amazon
const GARDEN_PATIO_NODE_ID = '2972638011';

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

// AWS Signature V4 signing using aws4 library
async function signRequest(endpoint, payload) {
  const amzTarget = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems";
  const content = JSON.stringify(payload);

  const { hostname, pathname } = url.parse(endpoint);

  const opts = {
    host: hostname,
    path: pathname,
    service: 'ProductAdvertisingAPI',
    region: 'us-east-1', // Use the region for your marketplace, 'us-east-1' for US
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Amz-Target': amzTarget,
      'Accept': 'application/json'
    },
    body: content
  };

  // Sign the request, modifying headers in-place
  aws4.sign(opts, {
    accessKeyId: AMAZON_ACCESS_KEY,
    secretAccessKey: AMAZON_SECRET_KEY
  });

  // aws4 puts the signed headers in opts.headers
  return opts.headers;
}

module.exports = { fetchGardenPatioDeals };
